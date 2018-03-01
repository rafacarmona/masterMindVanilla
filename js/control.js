{
	//Rafael Carmona Arrabal. JS de control MasterMind. 
	//actualizado: ya siempre hace el scroll hacia arriba al crear el elemento. al final sale una ventana "modal" 
	// y nos pregunta si queremos salir o reiniciar la partida. todos los elementos graficos están declarados fuera
	//del objeto masterMind. varias actualizaciones más y resuelto bug de blancas.
	let devuelveBotones = function(){
		return [document.getElementById("azul"), document.getElementById("blanco"), document.getElementById("negro"), document.getElementById("naranja"), document.getElementById("verde"), document.getElementById("rojo"), document.getElementById("marron"), document.getElementById("amarillo")];
	}
	let arrayColores = ["rojo", "amarillo", "verde", "naranja", "azul", "blanco", "marron", "negro"];
	let ultimaCaja, elementosUltimaCaja;
	let arrayCirculos = [undefined, undefined, undefined, undefined];

	//funciones.
	let dibujarCirculo = function(ultimaCaja, color, img){
		if(!this.terminado){
			let elementosLastCaja = ultimaCaja.children[ultimaCaja.children.length-1];
			for(let i = 0; i<4; i++){
				if(arrayCirculos[i] === undefined){
					arrayCirculos[i] = color;
					elementosLastCaja.children[i].src = img;
					elementosLastCaja.children[i].className = "lleno";
					//nos saltamos el for.
					break;
				}
			}
		}
	}

	//quitamos el circulo de color y lo eliminamos del array.
	let quitarCirculo = function(elemento, index){
		if(elemento.className != "vacio" && elemento.className != "bloqueado" && !this.terminado){
			//quitar imagen
			elemento.src = 'imgs/circulo_open.svg';
			arrayCirculos[index] = undefined;
			elemento.className= 'vacio';
		}
	}

	let crearHijo = function(){
		ultimaCaja = document.querySelector('#principalTablero');
		//creamos el hijo.
		let hijo = document.createElement('div');
		hijo.id = 'circulosARellenar';
		hijo.className = 'rellenar';
		//ahora creamos las imagenes
		for(let i = 0; i<4; i++){
			let circulo = document.createElement('img');
			circulo.src = 'imgs/circulo_open.svg';
			circulo.className = 'vacio';
			circulo.addEventListener("click", quitarCirculo.bind(null, circulo, i));
			hijo.appendChild(circulo);
		}

		//segundo div
		let divPuntuacion = document.createElement('div');
		divPuntuacion.id = "circulosBlancosNegros";
		divPuntuacion.className = "blancosNegros";
		for(let i=0; i<4; i++){
			let circulo = document.createElement('img');
			circulo.src = 'imgs/circulo_open.svg';
			circulo.className = 'vacio';
			divPuntuacion.appendChild(circulo);
		}
		hijo.appendChild(divPuntuacion);
		ultimaCaja.appendChild(hijo);
		ultimaCaja.scrollTo(0,0);
		return ultimaCaja;
	}

	let colocarPuntuacion = function(negras, blancas, cajaNegrasBlancas){
		total = negras;
		//declaramos el contador
		let contador = 0;
		do{
			if(negras>0){
				cajaNegrasBlancas.children[contador].src = "imgs/circulo_black.svg";
				negras--;
				contador++;
			}

			if(blancas>0 && negras === 0){
				cajaNegrasBlancas.children[contador].src = "imgs/circulo_white.svg";
				blancas--;
				contador++;
			}
		}while(negras > 0 || blancas > 0);
		return total;	
	}

	let mostrarMsgVictoria = function(ventanaModal, capaGris){
		ventanaModal.className = "modalPage";
		capaGris.className = "capaGris";
	}

	let removeAllElements = function(ultimaCaja){
		 while(ultimaCaja.hasChildNodes())
			ultimaCaja.removeChild(ultimaCaja.firstChild);
		ventanaModal.className = "modalPageNoUse";
		capaGris.className = "capaGrisNoUse";
	}

	//masterMind.
	var masterMind = function(){
		let arrayRandCol = [];
		let terminado = false;

		let iniciarJuego = function(){
			arrayRandCol = [];//nos aseguramos que siempre tenga 0 valores antes de empezar a rellenar
			for(let i = 0; i < 4; i++){
				arrayRandCol.push(arrayColores[Math.floor(Math.random() * (8))])
			}
			//arrayRandCol = ["verde", "verde", "azul", "amarillo"];
			//console.log(arrayRandCol);
		}
		let mostrar = function(){
			console.log(arrayRandCol);
		}

		let comprobarCoincidencia = function(cajaNegrasBlancas){
			let negras = 0;
			let blancas = 0;
			let arrayRandColCopia = arrayRandCol.slice();
			//comprobar negras
			arrayCirculos.forEach(function(elemento, index){
				if(arrayRandColCopia[index] === elemento){
					arrayRandColCopia[index] = undefined;
					arrayCirculos[index] = "esNegra";
					negras++;
				}
			});
			console.log("NEGRAS: " + negras);
			//comprobar blancas
			for(let i=0; i < 4; i++){
				if(arrayRandColCopia.indexOf(arrayCirculos[i])>=0){
					blancas++;
				}
			}
			console.log("BLANCAS: " + blancas);
			//guarda el valor total de las bolas negras que hay.
			return colocarPuntuacion(negras, blancas, cajaNegrasBlancas);
		}


		let comprobarJuego = function(ultimaCaja, index){
			if(arrayCirculos.indexOf(undefined) === -1){
				elementosUltimaCaja = ultimaCaja.children[ultimaCaja.children.length-1];
				//comprueba si hay menos de 4 coincidencias
				if(comprobarCoincidencia(elementosUltimaCaja.children[elementosUltimaCaja.children.length-1]) < 4){
					crearHijo();//crea el hijo
					for(let i = 0; i<4; i++){
						arrayCirculos[i] = undefined;
						elementosUltimaCaja.children[i].className = "bloqueado";
						elementosUltimaCaja.children[i].style = "cursor: none";
					}
				}else{//termina el juego
					this.terminado = true;
					//alert("has ganado!");
					return true;
				}
				return false;
			}
		}

		let reiniciarPartida = function(ultimaCaja, capaGris, ventanaModal){
			removeAllElements(ultimaCaja, capaGris, ventanaModal);
			init();
		}

		let init = function(){
			//creamos el primer hijo.
			crearHijo();
			//reiniciamos valores
			arrayCirculos = [undefined, undefined, undefined, undefined];
			this.terminado = false;
			return iniciarJuego();
		}

		let salir = function(){
			window.close();
		}

		return {
			init : init,
			comprobarJuego : comprobarJuego,
			reiniciarPartida : reiniciarPartida,
			salir : salir,
			mostrar : mostrar
		}
	}();

	let init = function(){
		ultimaCaja = document.getElementById('principalTablero');
		botonComprobarPartida = document.getElementById("compruebaPartida");		
		botonReiniciarPartida = document.getElementById("reiniciarPartida");
		botonSalir = document.getElementById("salirPartida");		
		//capa ventana modal y capa gris
		ventanaModal = document.getElementById("ventanaModal");
		capaGris = document.getElementById("capaGris");
		//iniciamos el juego
		masterMind.init();
		//inicializamos el ultimo hijo de la caja.
		devuelveBotones().forEach(function(elemento, index){
			elemento.addEventListener("click", dibujarCirculo.bind(null, ultimaCaja, elemento.id, elemento.src));
		});

		botonComprobarPartida.addEventListener("click", function(){
			if(masterMind.comprobarJuego(ultimaCaja)){
				mostrarMsgVictoria(ventanaModal,capaGris);
			}
		});
		botonReiniciarPartida.addEventListener("click", masterMind.reiniciarPartida.bind(null, ultimaCaja, capaGris, ventanaModal));
		botonSalir.addEventListener("click", masterMind.salir);
	}
	window.onload = init;
}