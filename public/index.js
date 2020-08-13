(() => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("Este es el usuario", user);
      sesionIniciada();
    } else {
      console.log("Nadie logueado");
      iniciarSesion();
    }
  });

  let navInicio = document.getElementById("navInicio");
  let navRegistro = document.getElementById("navRegistro");
  let inicio = document.getElementById("inicio");
  let perfil = document.getElementById("perfil");
  let contenido = document.getElementById("contenido");
  let feedUser = document.getElementById("feedUser");

  //Navegacion de los tabs en el inicio de sesion
  navRegistro.onclick = tabRegistro = () => {
    inicio.innerHTML = /*html*/ `
      <div id="registro">
      <h2 class="my-2">Registrar</h2>
      <input
        id="rUser"
        type="text"
        class="form-control my-2"
        placeholder="Nombre de usuario"
      />
      <input
        id="rEmail"
        type="email"
        class="form-control my-2"
        placeholder="Correo Electrónico"
      />
      <input
        id="rClave"
        type="password"
        class="form-control my-2"
        placeholder="Contraseña"
      />
      <button id="botonR" class="btn btn-outline-info">
        Registrar
      </button>
    </div>
      `;
    //Registrar un nuevo usuario
    (() => {
      let rUser = document.getElementById("rUser");
      let rEmail = document.getElementById("rEmail");
      let rClave = document.getElementById("rClave");
      let botonR = document.getElementById("botonR");

      botonR.onclick = () => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(rEmail.value, rClave.value)
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              console.log("Registro correcto", res);
              database
                .collection("users")
                .add({
                  Username: rUser.value,
                  UID: user.uid,
                  Email: rEmail.value,
                  Password: rClave.value,
                })
                .then((res) => {
                  console.log("Se agrego el usuario a la base de datos", res);
                  rEmail.value = "";
                  rClave.value = "";
                })
                .catch((err) =>
                  console.log(
                    "Hubo un error al momento de guardar el usuario en la base de datos",
                    err
                  )
                );
            });
          })
          .catch((error) => console.log("Hubo un error al registrar", error));
      };
    })();
  };

  navInicio.onclick = iniciarSesion = () => {
    inicio.innerHTML = /*html*/ `
    <div id="inicio">
      <h2 class="my-2">Iniciar sesión</h2>
      <input
        id="iEmail"
        type="email"
        class="form-control my-2"
        placeholder="Correo Electrónico"
      />
      <input
        id="iClave"
        type="password"
        class="form-control my-2"
        placeholder="Contraseña"
      />
      <div>
        <button id="botonI" class="btn btn-outline-info">
          Iniciar sesión
        </button>
      </div>
    </div>
    `;
    let iEmail = document.getElementById("iEmail");
    let iClave = document.getElementById("iClave");
    botonI = document.getElementById("botonI");
    botonI.addEventListener("click", async () => {
      console.log("Me presionaste");
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(iEmail.value, iClave.value)
          .then((res) => {
            console.log("Ingreso correcto", res);
          });
      } catch (error) {
        console.log("Hubo un error al ingresar", error.code);
        iEmail.value = "";
        iClave.value = "";
      }
    });
  };

  let dataUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      database.collection("users").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (user.uid === doc.data().UID) {
            nombreUser.innerHTML = /*html*/ `
              ${doc.data().Username}
            `;
            database.collection("publicaciones").onSnapshot((res) => {
              correo.innerHTML = /*html*/ `
              Correo: ${doc.data().Email}`;
              let veces = [];
              let inicio = 0;
              res.forEach((doc) => {
                if (user.email == doc.data().email) {
                  veces.push(inicio);
                  inicio++;
                  publicaciones.innerHTML = /*html*/ `
                  Publicaciones: ${veces.length}`;
                }
              });
              fotoPerfil.src = doc.data().photoURL;
            });
          }
        });
      });
    });
  };

  let mostrarUsername = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        database.collection("users").onSnapshot((querySnapshot) => {
          querySnapshot.forEach((res) => {
            if (user.uid === res.data().UID) {
              mostrarNombre = document.getElementById("mostrarNombre");
              mostrarNombre2 = document.getElementById("mostrarNombre2");
              mostrarNombre.innerHTML = /*html*/ `
                      ${res.data().Username}
                    `;
              mostrarNombre2.innerHTML = /*html*/ `
                      ${res.data().Username}
                    `;
            }
          });
        });
      }
    });
  };

  let postear = () => {
    perfil.innerHTML = /*html*/ `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8">
          <div class="row justify-content-center rounded contenedorNombre">
            <div class="row justify-content-center">
              <div class="col-12 d-inline cuerpo">
                <div class="d-inline"><img id="imgProfile"></div>
                <div id="mostrarNombre" class="d-inline"></div>
              </div>
            </div>
            <div type="text" id="botonNewPost" class="col-12 btn btn-outline-info" data-toggle="modal" data-target="#ventanaModal">Nuevo post</div>
          </div>
          <div class="modal" id="ventanaModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header bg-info">
                  <h5 class="modal-title">Crear post</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="card">
                  <div class="row justify-content-center">
                    <img id="profileImage" class="">
                    <span class="" id="mostrarNombre2"></span> <br>
                  </div>
                  <div class="card-body">
                    <input type="file" id="imgPlace" accept="image/*" class="d-none">
                      <label for="imgPlace" id="label">
                          <img id="publicacionImg" src="assets/camera.png">
                      </label>
                    <div class="card-text">
                      <textarea type="text" id="postArea" class="border form-control h-25 card-text my-3" placeholder="Escribe aquí..." style="height: 250px; resize: none; font-size: 25px; border:none"></textarea>
                    </div>
                    <div id="divBoton">
                      <button type="button" id="botonPost" class="btn btn-info form-control text-light">Post</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    firebase.auth().onAuthStateChanged((user) => {
      database.collection("users").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (user.uid === doc.data().UID) {
            imgProfile.src = doc.data().photoURL;
            profileImage.src = doc.data().photoURL;

            let imgPlace = document.querySelector("#imgPlace");
            imgPlace.onchange = () => {
              if (imgPlace) {
                let label = document.getElementById("label");
                label.style.background = "#46abca";
              }
            };
          }
        });
      });
    });

    botonPost.onclick = () => {
      let user = firebase.auth().currentUser;
      let imgPlace = document.getElementById("imgPlace").files[0];

      if (imgPlace) {
        let referencia = storage.ref("/Publicaciones/" + imgPlace.name);
        let task = referencia.put(imgPlace);
        let count = new Date();

        task.then(() => {
          referencia.getDownloadURL().then((url) => {
            database
              .collection("publicaciones")
              .add({
                count: count,
                email: user.email,
                userUID: user.uid,
                feed: postArea.value,
                url: url,
              })
              .then(() => {
                postArea.value = "";
                window.location.reload();
              });
          });
        });
      } else {
        console.log("Sube una imagen");
      }
    };
  };

  let mostrarPublicaciones = () => {
    firebase.auth().onAuthStateChanged((user) => {
      database
        .collection("publicaciones")
        .orderBy("count", "desc")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (user) {
              contenido.innerHTML += /*html*/ `
            <div class="row justify-content-center pt-3">
              <div class="col col-sm-8">
                <div class="card ventanaPublicacion position-sticky" style="widht: 20rem;">
                  <div class="card-tittle cardtittle bg-info py-2 pl-3">
                  ${doc.data().email}
                  <button type="button" id="deleteFeed" class="close mr-4" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>
                  <img class="card-img-top border" src="${doc.data().url}">
                  <div class="card-body">
                    <p class="card-text cardFeed">${doc.data().feed}</p>
                  </div>
                </div>
              </div>
            </div>`;
            }
          });
        });
    });
  };

  let sesionIniciada = () => {
    pantallaPrincipal.innerHTML = /*html*/ `
    <nav class="navbar navbar-expand-sm fixed-top navbar-light bg-info py-3 heading" >
      <div class="container">
        <a class="navbar-brand d-inline-block" id="irInicio"><img id="imgInicio" src="assets/logo.png"></a>
        <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#primerCollapse" >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse mx-auto" id="primerCollapse">
          <li class="nav-item buscar d-none d-md-block">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Username"/>
              <div class="input-group-append">
                <button class="btn btn-outline-light" type="button">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </li>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a href="#" class="nav-link" id="perfil">Perfil</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" id="salir">Salir</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;

    mostrarUsername();
    postear();

    botonIrInicio = document.getElementById("irInicio");
    botonIrInicio.addEventListener("click", () => {
      sesionIniciada();
      mostrarPublicaciones();
      feedUser.innerHTML = null;
    });

    botonP = document.getElementById("perfil");
    botonP.addEventListener("click", () => {
      perfil.innerHTML = /*html*/ `
      <div class="row justify-content-center">
        <div class="col-lg-2 col-md-3 col-4 contenedorImg">
          <div>
            <div data-toggle="modal" data-target="#staticBackdrop">
              <img id="fotoPerfil" src="assets/user1.png">
            </div>
            <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="cardTittle">Cambiar foto</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="d-inline">
                      <input type="file" id="fileImg" class="w-50" accept="image/*">
                        <button class="btn btn-outline-info w-25 float-right" id="subirFoto">
                          Subir
                        </button>
                    </div>
                  </div>
                  <div class="modal-footer" id="cerrarModal">
                    <button type="button" class="btn btn-outline-info w-100" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 contenedorImg">
          <div class="py-2 d-inline">
            <div id="nombreUser" class="d-inline"></div>
            <div id="selection" class="btn btn-outline-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="">
              <span class="sr-only"></span>
            </div>
            <div class="dropdown-menu">
              <li class="dropdown-item" id="correo" href="#">Correo: </li>
              <li class="dropdown-item" id="publicaciones" href="#">Publicaciones: </li>
            </div>
          </div>
        </div>
      </div>
      `;
      dataUser();

      contenido.innerHTML = null;

      subirFoto = document.getElementById("subirFoto");
      subirFoto.addEventListener("click", () => {
        let user = firebase.auth().currentUser;
        let file = document.querySelector("#fileImg").files[0];
        if (!file) {
        } else {
          let storageRef = storage.ref("/Fotos de perfil/" + file.name);
          let uploadTask = storageRef.put(file);
          uploadTask.then((snapshot) => {
            console.log("Archivo subido");
            storageRef.getDownloadURL().then((url) => {
              database
                .collection("users")
                .where("UID", "==", user.uid)
                .get()
                .then((res) => {
                  let userPath = res.docs[0].id;
                  let actualizarElem = database
                    .collection("users")
                    .doc(userPath);
                  return actualizarElem.update({
                    photoURL: url,
                  });
                })
                .then(() => {
                  cerrarModal = document.getElementById("cerrarModal");
                  cerrarModal.innerHTML = /*html*/ `
                    <button type="button" class="btn btn-outline-success w-100" data-dismiss="modal">
                      Foto actualizada, puedes cerrar
                    </button>`;
                });
              let fotoPerfil = document.getElementById("fotoPerfil");
              fotoPerfil.src = url;
            });
          });
        }
      });

      firebase.auth().onAuthStateChanged((user) => {
        database
          .collection("publicaciones")
          .orderBy("count", "desc")
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.data().userUID == user.uid) {
                feedUser.innerHTML += /*html*/ `
              <div class="col-3 feed pt-3">
                <div class="card feedCard" style="widht: 15rem;">
                  <img id="imgFeed" class="card-img-top border feedImg" src="${doc.data().url}"  data-toggle="modal" data-target="#modal3"> 
                </div>
              </div>`;
              }
            });
          });
      });
    });


    botonS = document.getElementById("salir");
    botonS.addEventListener("click", () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Sesion cerrada");
          window.location.reload();
        })
        .catch((err) => console.log(err));
    });
  };

  mostrarPublicaciones();
})();