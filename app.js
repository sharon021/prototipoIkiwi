const actividadesAgricolas = [
  { titulo:"Poda", icono:"✂️", detalle:"Eliminación de ramas innecesarias para mejorar la ventilación, entrada de luz y productividad del cultivo.", responsable:"Capataz / Operario", etapa:"Manejo del cultivo", registro:"Fecha, lote, responsable, observaciones y horas trabajadas." },
  { titulo:"Atada", icono:"🌿", detalle:"Sujeción de ramas a la estructura de soporte para ordenar el crecimiento de la planta.", responsable:"Operario Agrícola", etapa:"Formación de estructura", registro:"Lote, cantidad de plantas intervenidas y tiempo empleado." },
  { titulo:"Despunte", icono:"🌱", detalle:"Corte de brotes para controlar el crecimiento vegetativo y favorecer el desarrollo productivo.", responsable:"Capataz / Operario", etapa:"Manejo vegetativo", registro:"Lote, sector, fecha y observaciones." },
  { titulo:"Raleo previo a polinización", icono:"🌼", detalle:"Selección previa de flores para mejorar la calidad del fruto futuro.", responsable:"Técnico Agrónomo / Capataz", etapa:"Pre-polinización", registro:"Porcentaje de avance, lote y criterio aplicado." },
  { titulo:"Polinización", icono:"🐝", detalle:"Transferencia de polen para asegurar la formación del fruto.", responsable:"Técnico Agrónomo / Capataz", etapa:"Floración", registro:"Lote, fecha, porcentaje de flor abierta y condiciones climáticas." },
  { titulo:"Raleo post polinización", icono:"🥝", detalle:"Eliminación de frutos excedentes para mejorar tamaño, calidad y uniformidad de la cosecha.", responsable:"Operario / Capataz", etapa:"Post-polinización", registro:"Cantidad estimada de frutos removidos y lote intervenido." },
  { titulo:"Poda en verde", icono:"🍃", detalle:"Poda realizada durante el crecimiento activo para controlar exceso de vegetación.", responsable:"Capataz / Operario", etapa:"Crecimiento", registro:"Lote, sector, fecha y observaciones." },
  { titulo:"Cosecha", icono:"🧺", detalle:"Recolección de kiwis según madurez, calidad y planificación comercial.", responsable:"Capataz / Operario", etapa:"Producción", registro:"Kilos cosechados, lote, fecha y destino." },
  { titulo:"Aplicación de agroquímicos", icono:"🧪", detalle:"Registro de productos aplicados para control sanitario y trazabilidad de exportación.", responsable:"Técnico Agrónomo", etapa:"Sanidad vegetal", registro:"Producto, dosis, lote, fecha, responsable y receta." },
  { titulo:"Monitoreo de riego", icono:"💧", detalle:"Control del estado hídrico del cultivo mediante sensores o registros de campo.", responsable:"Capataz / Técnico Agrónomo", etapa:"Riego", registro:"Humedad, lote, alertas y recomendaciones." },
  { titulo:"Control de maleza", icono:"🌾", detalle:"Seguimiento y control de malezas que compiten con el cultivo por agua y nutrientes.", responsable:"Operario / Capataz", etapa:"Mantenimiento", registro:"Sector afectado, método de control y fecha." },
  { titulo:"Control de heladas", icono:"❄️", detalle:"Monitoreo de temperatura y activación de medidas preventivas ante riesgo de heladas.", responsable:"Capataz / Técnico Agrónomo", etapa:"Prevención climática", registro:"Temperatura, lote, alerta y acción tomada." },
  { titulo:"Combustible utilizado", icono:"⛽", detalle:"Registro del combustible consumido en recorridos, maquinaria o tareas operativas.", responsable:"Personal Contable / Capataz", etapa:"Control operativo", registro:"Litros, vehículo, actividad, lote y responsable." }
];

const roles = {
  socios: { label:"Socios / Dueños / Accionistas", access:"all" },
  capataz: { label:"Capataz de Campo", access:["dashboard","drones","plagas","floracion","lotes","tiempo","reportes"] },
  agronomo: { label:"Técnico Agrónomo", access:["dashboard","plagas","floracion","agroquimicos","lotes","reportes"] },
  operario: { label:"Operario Agrícola", access:["dashboard","drones","tiempo","lotes"] },
  administrativo: { label:"Personal Administrativo", access:["dashboard","agroquimicos","lotes","reportes"] },
  contable: { label:"Personal Contable", access:["dashboard","tiempo","reportes","decisiones"] }
};

const pages = [
  ["dashboard","Tablero General","📊"],
  ["drones","Recorridos de drones","🚁"],
  ["plagas","Detección de plagas IA","🪲"],
  ["floracion","Control de floración","🌼"],
  ["agroquimicos","Trazabilidad de agroquímicos","🧪"],
  ["lotes","Historial por lote","🗂️"],
  ["tiempo","Tiempo de trabajo","⏱️"],
  ["reportes","Reportes automatizados","📄"],
  ["decisiones","Informes gerenciales","📈"],
  ["admin","Administración y roles","🔐"]
];

let currentRole = "";
let currentUser = "";

let registeredUsers = JSON.parse(localStorage.getItem("ikiwiUsers")) || [
  { name:"Socio Demo", email:"socio@ikiwi.com", password:"Ikiwi@123", role:"socios" },
  { name:"Administrativo Demo", email:"admin@ikiwi.com", password:"Ikiwi@123", role:"administrativo" },
  { name:"Contable Demo", email:"contable@ikiwi.com", password:"Ikiwi@123", role:"contable" }
];

function saveUsers(){
  localStorage.setItem("ikiwiUsers", JSON.stringify(registeredUsers));
}

function validateInstitutionalEmail(email){
  return /^[a-zA-Z0-9._%+-]+@ikiwi\.com$/.test(email);
}

function validatePassword(password){
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

function isStrongPassword(password){
  const rules = validatePassword(password);
  return rules.length && rules.upper && rules.lower && rules.special;
}

function showMessage(id, text){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = text;
  el.classList.remove("hidden");
}

function hideMessage(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add("hidden");
}

function switchAuth(mode){
  const isLogin = mode === "login";
  document.getElementById("loginForm").classList.toggle("hidden", !isLogin);
  document.getElementById("registerForm").classList.toggle("hidden", isLogin);
  document.getElementById("tabLogin").classList.toggle("active", isLogin);
  document.getElementById("tabRegister").classList.toggle("active", !isLogin);
  hideMessage("loginError");
  hideMessage("registerError");
  hideMessage("registerSuccess");
}

function updatePasswordRules(){
  const password = document.getElementById("registerPassword").value;
  const rules = validatePassword(password);
  const map = {
    ruleLength: rules.length,
    ruleUpper: rules.upper,
    ruleLower: rules.lower,
    ruleSpecial: rules.special
  };
  Object.entries(map).forEach(([id, valid]) => {
    const item = document.getElementById(id);
    if(!item) return;
    item.classList.toggle("valid", valid);
    item.classList.toggle("invalid", password.length > 0 && !valid);
  });
}

function registerAccount(event){
  event.preventDefault();
  hideMessage("registerError");
  hideMessage("registerSuccess");

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  if(name.length < 3){
    showMessage("registerError", "Ingresá nombre y apellido.");
    return;
  }

  if(!validateInstitutionalEmail(email)){
    showMessage("registerError", "El mail debe terminar en @ikiwi.com");
    return;
  }

  if(!isStrongPassword(password)){
    showMessage("registerError", "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.");
    return;
  }

  if(registeredUsers.some(user => user.email === email)){
    showMessage("registerError", "Ya existe una cuenta registrada con ese mail.");
    return;
  }

  registeredUsers.push({ name, email, password, role });
  saveUsers();

  document.getElementById("registerForm").reset();
  updatePasswordRules();
  document.getElementById("loginEmail").value = email;
  document.getElementById("loginPassword").value = "";

  switchAuth("login");
  showMessage("loginError", "Cuenta creada correctamente. Iniciá sesión con tu contraseña.");
}

function login(event){
  event.preventDefault();
  hideMessage("loginError");

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if(!validateInstitutionalEmail(email)){
    showMessage("loginError", "El mail debe terminar en @ikiwi.com");
    return;
  }

  const account = registeredUsers.find(user => user.email === email && user.password === password);

  if(!account){
    showMessage("loginError", "Mail o contraseña incorrectos. Primero creá una cuenta o revisá los datos.");
    return;
  }

  currentRole = account.role;
  currentUser = account.name;

  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  document.getElementById("roleName").textContent = roles[currentRole].label;
  document.getElementById("welcome").textContent = `Hola ${currentUser}. Rol detectado automáticamente: ${roles[currentRole].label}.`;

  buildMenu();
  renderAll();
  showPage("dashboard");
}

function logout(){
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("loginPassword").value = "";
  currentRole = "";
  currentUser = "";
}

function can(pageId){
  const roleConfig = roles[currentRole];
  if(!roleConfig) return false;
  if(roleConfig.access === "all") return true;
  return roleConfig.access.includes(pageId);
}

function buildMenu(){
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  pages.forEach(([id, title, icon]) => {
    if(can(id)){
      const btn = document.createElement("button");
      btn.className = "nav-btn";
      btn.id = "nav-" + id;
      btn.innerHTML = `${icon} ${title}`;
      btn.onclick = () => showPage(id);
      menu.appendChild(btn);
    }
  });
}

function showPage(id){
  pages.forEach(([pageId]) => {
    const view = document.getElementById("view-" + pageId);
    const nav = document.getElementById("nav-" + pageId);
    if(view) view.classList.add("hidden");
    if(nav) nav.classList.remove("active");
  });

  if(!can(id)){
    blocked(id);
    return;
  }

  document.getElementById("view-" + id).classList.remove("hidden");
  document.getElementById("pageTitle").textContent = pages.find(page => page[0] === id)[1];

  const activeNav = document.getElementById("nav-" + id);
  if(activeNav) activeNav.classList.add("active");
}

function blocked(id){
  document.getElementById("pageTitle").textContent = "Acceso restringido";
  document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));

  const dashboard = document.getElementById("view-dashboard");
  dashboard.classList.remove("hidden");
  dashboard.innerHTML = `
    <div class="card blocked">
      <div>
        <div class="lock">🔒</div>
        <h2>Funcionalidad no habilitada</h2>
        <p>El rol ${roles[currentRole].label} no posee permisos para acceder a ${id}.</p>
      </div>
    </div>
  `;
}

function setOffline(){
  const dot = document.getElementById("syncDot");
  const text = document.getElementById("syncText");
  if(!dot || !text) return;

  const offline = Math.random() < 0.25;
  dot.style.background = offline ? "#d68910" : "#1e8449";
  text.textContent = offline ? "Modo offline · datos locales" : "Sincronizado";
}

setInterval(setOffline, 5000);

function renderAll(){
  renderDashboard();
  renderDrones();
  renderPlagas();
  renderFloracion();
  renderAgro();
  renderLotes();
  renderTiempo();
  renderReportes();
  renderDecisiones();
  renderAdmin();
}

function renderDashboard(){
  document.getElementById("view-dashboard").innerHTML = `
    <div class="alert-strip">
      ⚠️ Alerta crítica: Trips del kiwi detectado en Lote A3. Se recomienda tratamiento en 24-48 hs.
    </div>

    <div class="grid cards">
      <div class="card animated-card"><h3>Lotes monitoreados</h3><div class="metric">4</div><p>Con monitoreo por dron</p></div>
      <div class="card animated-card"><h3>Alertas activas</h3><div class="metric pulse-number">4</div><p>2 críticas · 1 media · 1 baja</p></div>
      <div class="card animated-card"><h3>Imágenes procesadas</h3><div class="metric">384</div><p>Analizadas por IA</p></div>
      <div class="card animated-card"><h3>Floración promedio</h3><div class="metric">42%</div><p>Base para predicción de cosecha</p></div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Mapa sanitario en tiempo real</h3>

      <div class="satellite-map" style="height:540px;">
        <div class="scan-line"></div>
        <div class="map-road road-1"></div>
        <div class="map-road road-2"></div>

        <span class="parcel p1">Lote A3</span>
        <span class="parcel p2">Lote B2</span>
        <span class="parcel p3">Lote C1</span>
        <span class="parcel p4">Lote D4</span>

        <span class="drone-marker">🚁</span>

        <span class="hotspot red" style="width:84px;height:84px;left:22%;top:38%"></span>
        <span class="hotspot orange" style="width:64px;height:64px;left:62%;top:28%"></span>
        <span class="hotspot yellow" style="width:48px;height:48px;left:76%;top:66%"></span>
      </div>

      <div class="actions" style="margin-top:12px">
        <button onclick="showPage('plagas')">Ver detecciones</button>
        <button class="secondary" onclick="showPage('floracion')">Ver floración</button>
        <button class="secondary" onclick="fakeSave('Mapa sanitario exportado correctamente')">Exportar mapa</button>
      </div>
    </div>
  `;
}

function verDetalleActividad(index){
  const actividad = actividadesAgricolas[index];
  const detalle = document.getElementById("detalleActividad");

  detalle.innerHTML = `
    <div class="card detalle-actividad">
      <h2>${actividad.icono} ${actividad.titulo}</h2>
      <p><b>Descripción:</b> ${actividad.detalle}</p>
      <p><b>Responsable:</b> ${actividad.responsable}</p>
      <p><b>Etapa del cultivo:</b> ${actividad.etapa}</p>
      <p><b>Registro que debe guardar el sistema:</b> ${actividad.registro}</p>
      <div class="actions">
        <button onclick="fakeSave('Registro de ${actividad.titulo} guardado correctamente')">Registrar actividad</button>
        <button class="secondary" onclick="document.getElementById('detalleActividad').innerHTML = ''">Cerrar detalle</button>
      </div>
    </div>
  `;

  detalle.scrollIntoView({ behavior:"smooth", block:"start" });
}

function renderDrones(){
  document.getElementById("view-drones").innerHTML = `
    <div class="grid cards">
      <div class="card">
        <h3>Último recorrido</h3>
        <div class="metric">CU003</div>
        <p>Dron DJI-KW-02 · Sierra de los Padres</p>
      </div>

      <div class="card">
        <h3>Procesamiento IA</h3>
        <div class="metric pulse-number">78%</div>
        <p>Generando mapa sanitario</p>
      </div>

      <div class="card">
        <h3>Imágenes procesadas</h3>
        <div class="metric">384</div>
        <p>Georreferenciadas</p>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Registrar recorrido de dron</h3>

      <div class="grid form-grid">
        <input placeholder="ID recorrido" value="REC-2026-0526-A3">

        <select>
          <option>Lote A3</option>
          <option>Lote B2</option>
          <option>Lote C1</option>
          <option>Lote D4</option>
        </select>

        <input type="datetime-local">

        <button onclick="fakeSave('Recorrido registrado y enviado a procesamiento')">
          Guardar recorrido
        </button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Estado de misiones</h3>

      <table>
        <tr>
          <th>Recorrido</th>
          <th>Lote</th>
          <th>Estado</th>
          <th>Resultado</th>
        </tr>

        <tr>
          <td>REC-0526-A3</td>
          <td>A3</td>
          <td><span class="tag warn">Procesando</span></td>
          <td>Mapa sanitario preliminar · Posible Trips del kiwi detectado</td>
        </tr>

        <tr>
          <td>REC-0526-B2</td>
          <td>B2</td>
          <td><span class="tag ok">Finalizado</span></td>
          <td>Araña roja detectada · Floración estimada 28%</td>
        </tr>

        <tr>
          <td>REC-0525-C1</td>
          <td>C1</td>
          <td><span class="tag ok">Finalizado</span></td>
          <td>Sin plagas detectadas · Floración estimada 15%</td>
        </tr>

        <tr>
          <td>REC-0525-D4</td>
          <td>D4</td>
          <td><span class="tag ok">Finalizado</span></td>
          <td>Floración uniforme · Sin alertas sanitarias</td>
        </tr>
      </table>
    </div>
  `;
}

function renderPlagas(){
  document.getElementById("view-plagas").innerHTML = `
    <div class="grid cards">
      <div class="card"><h3>Crítico</h3><div class="metric">1</div><p>Alta severidad</p></div>
      <div class="card"><h3>Atención</h3><div class="metric">2</div><p>Severidad media</p></div>
      <div class="card"><h3>Bajo control</h3><div class="metric">1</div><p>Severidad baja</p></div>
      <div class="card"><h3>Áreas afectadas</h3><div class="metric">5.6</div><p>Hectáreas</p></div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Detección de plagas por IA</h3>
      <table>
        <tr>
          <th>Imagen</th>
          <th>Lote</th>
          <th>Detección IA</th>
          <th>Confianza</th>
          <th>Severidad</th>
          <th>Estado</th>
        </tr>
        <tr>
          <td>IMG-A3-0526.jpg</td>
          <td>A3</td>
          <td id="plagaDetectadaA3">Trips del kiwi</td>
          <td>94%</td>
          <td><span class="tag danger">Alta</span></td>
          <td id="estadoPlagaA3"><span class="tag warn">Pendiente de validación</span></td>
        </tr>
        <tr>
          <td>IMG-B2-0526.jpg</td>
          <td>B2</td>
          <td>Araña roja</td>
          <td>87%</td>
          <td><span class="tag warn">Media</span></td>
          <td><span class="tag warn">Pendiente de validación</span></td>
        </tr>
      </table>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Validación</h3>
      <p>
     
      </p>

      <div class="grid two">
        <div>
          <h4>Imagen capturada por el dron</h4>
          <img 
            src="img/plagaA3.png"
            alt="Imagen de plaga capturada por dron"
            style="width:100%; border-radius:10px; border:1px solid #ddd;"
          >
          <small>Imagen tomada durante el recorrido del Lote A3.</small>
        </div>

        <div>
          <h4>Análisis automático</h4>

          <p><b>Imagen:</b> IMG-A3-0526.jpg</p>
          <p><b>Lote:</b> A3</p>
          <p><b>Plaga detectada por IA:</b> <span id="plagaIA">Trips del kiwi</span></p>
          <p><b>Confianza IA:</b> 94%</p>
          <p><b>Severidad:</b> Alta</p>

          <p>
            <b>Recomendación generada:</b>
            <span id="recomendacionPlagaIA">
              Aplicar tratamiento en 24-48 hs y monitorear lotes adyacentes.
            </span>
          </p>

          <label>Corrección / validación</label>

          <select id="nuevaDeteccionPlaga">
            <option>Trips del kiwi</option>
            <option>Araña roja</option>
            <option>Mancha foliar</option>
            <option>Estrés hídrico</option>
            <option>No se confirma plaga</option>
            <option>Requiere inspección presencial</option>
          </select>

          <textarea
            id="observacionPlaga"
            placeholder="Observaciones del Ingeniero Agrónomo"
            style="margin-top:10px;"
          >Se valida la detección generada por IA.</textarea>

          <div class="actions" style="margin-top:10px">
            <button onclick="validarPlagaIA()">Validar detección</button>
            <button class="secondary" onclick="corregirPlagaIA()">Corregir detección</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function validarPlagaIA(){
  const observacion = document.getElementById("observacionPlaga").value;

  document.getElementById("estadoPlagaA3").innerHTML = `<span class="tag ok">Validado</span>`;

  alert(
    "✅ Detección validada por el Ingeniero Agrónomo.\n\n" +
    "La información será utilizada en el reporte final.\n\n" +
    "Observación: " + observacion
  );
}

function corregirPlagaIA(){
  const nuevaDeteccion = document.getElementById("nuevaDeteccionPlaga").value;
  const observacion = document.getElementById("observacionPlaga").value;

  document.getElementById("plagaIA").textContent = nuevaDeteccion;
  document.getElementById("plagaDetectadaA3").textContent = nuevaDeteccion;
  document.getElementById("estadoPlagaA3").innerHTML = `<span class="tag ok">Corregido</span>`;

  alert(
    "✏️ Detección corregida por el Ingeniero Agrónomo.\n\n" +
    "Nueva detección: " + nuevaDeteccion + "\n\n" +
    "Observación: " + observacion
  );
}

function renderFloracion(){
  document.getElementById("view-floracion").innerHTML = `
    <div class="grid two">
      <div class="card">
        <h3>Floración detectada por imágenes del dron</h3>
        <p>El sistema analiza las imágenes capturadas por el dron y estima automáticamente el porcentaje de apertura floral por lote.</p>

        <table>
          <tr>
            <th>Lote</th>
            <th>Imagen procesada</th>
            <th>Apertura floral IA</th>
            <th>Estado</th>
            <th>Recomendación</th>
          </tr>

          <tr>
            <td>A3</td>
            <td>IMG-A3-0526.jpg</td>
            <td>40%</td>
            <td><span class="tag ok">Listo para polinización</span></td>
            <td id="recomendacionA3">Planificar polinización</td>
          </tr>

          <tr>
            <td>B2</td>
            <td>IMG-B2-0526.jpg</td>
            <td>28%</td>
            <td><span class="tag warn">Seguimiento</span></td>
            <td>Revisar en 48 hs</td>
          </tr>

          <tr>
            <td>C1</td>
            <td>IMG-C1-0525.jpg</td>
            <td>15%</td>
            <td><span class="tag info">Temprano</span></td>
            <td>Esperar nueva imagen</td>
          </tr>
        </table>
      </div>

      <div class="card">
        <h3>Predicción de cosecha</h3>

        <div class="chart animated-bars">
          <div class="bar" style="--h:120px">A3</div>
          <div class="bar" style="--h:90px">B2</div>
          <div class="bar" style="--h:60px">C1</div>
          <div class="bar" style="--h:150px">D4</div>
        </div>

        <p>
          Estimación basada en el porcentaje de floración detectado por IA,
          estado sanitario del lote y monitoreos previos.
        </p>

        <table style="margin-top:12px">
          <tr>
            <th>Lote</th>
            <th>Floración IA</th>
            <th>Estado sanitario</th>
            <th>Cosecha estimada</th>
          </tr>

          <tr>
            <td>A3</td>
            <td>40%</td>
            <td><span class="tag danger">Trips detectado</span></td>
            <td>18.5 tn</td>
          </tr>

          <tr>
            <td>B2</td>
            <td>28%</td>
            <td><span class="tag warn">Araña roja</span></td>
            <td>12.2 tn</td>
          </tr>

          <tr>
            <td>C1</td>
            <td>15%</td>
            <td><span class="tag ok">Sin plagas</span></td>
            <td>8.7 tn</td>
          </tr>

          <tr>
            <td>D4</td>
            <td>50%</td>
            <td><span class="tag ok">Normal</span></td>
            <td>21.0 tn</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Validación del resultado generado por IA</h3>

      <div class="grid two">
        <div>
          <h4>Imagen capturada por el dron</h4>

          <img 
            src="img/floracionA3.png"
            alt="Imagen de floración capturada por dron"
            style="width:100%; border-radius:10px; border:1px solid #ddd;"
          >

          <small>Imagen tomada durante el recorrido del Lote A3.</small>
        </div>

        <div>
          <h4>Análisis automático</h4>

          <p><b>Imagen:</b> IMG-A3-0526.jpg</p>
          <p><b>Lote:</b> A3</p>
          <p><b>Apertura floral detectada:</b> 40%</p>
          <p><b>Confianza IA:</b> 92%</p>

          <p>
            <b>Recomendación generada:</b>
            <span id="recomendacionIA">Planificar polinización</span>
          </p>

          <label>Validación del Ingeniero Agrónomo</label>

          <select id="nuevaRecomendacionFloracion">
            <option>Planificar polinización</option>
            <option>Revisar en 48 hs</option>
            <option>No requiere polinización todavía</option>
            <option>Requiere inspección presencial</option>
          </select>

          <textarea
            id="observacionFloracion"
            placeholder="Observaciones del Ingeniero Agrónomo"
            style="margin-top:10px;"
          >Se valida la recomendación generada por IA.</textarea>

          <div class="actions" style="margin-top:10px">
            <button onclick="validarResultadoIA()">Validar resultado</button>
            <button class="secondary" onclick="corregirResultadoIA()">Corregir recomendación</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function validarResultadoIA(){
  const observacion = document.getElementById("observacionFloracion").value;

  alert(
    "✅ Resultado validado por el Ingeniero Agrónomo.\n\n" +
    "La recomendación será utilizada en el reporte final.\n\n" +
    "Observación: " + observacion
  );
}

function corregirResultadoIA(){
  const nuevaRecomendacion = document.getElementById("nuevaRecomendacionFloracion").value;
  const observacion = document.getElementById("observacionFloracion").value;

  document.getElementById("recomendacionIA").textContent = nuevaRecomendacion;
  document.getElementById("recomendacionA3").textContent = nuevaRecomendacion;

  alert(
    "✏️ Recomendación corregida por el Ingeniero Agrónomo.\n\n" +
    "Nueva recomendación: " + nuevaRecomendacion + "\n\n" +
    "Observación: " + observacion
  );
}

function renderAgro(){
  document.getElementById("view-agroquimicos").innerHTML = `
    <div class="card">
      <h3>Registrar uso de agroquímicos / fertilizantes</h3>
      <div class="grid form-grid">
        <select><option>Lote A3</option><option>Lote B2</option></select>
        <input placeholder="Producto" value="Insecticida o Fertilizante">
        <input placeholder="Dosis" value="1.2 L/ha">
        <input type="date">
        <button onclick="fakeSave('Aplicación fitosanitaria registrada para trazabilidad')">Guardar aplicación</button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Trazabilidad digital para auditorías</h3>
      <table>
        <tr>
          <th>Fecha</th>
          <th>Lote</th>
          <th>Producto</th>
          <th>Responsable</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>

        <tr>
          <td>26/05/2026</td>
          <td>A3</td>
          <td>Insecticida específico</td>
          <td>Ing. Agrónomo</td>
          <td id="estadoAgroA3"><span class="tag warn">Pendiente de validación</span></td>
          <td>
            ${currentRole === "agronomo" || currentRole === "socios" ? 
              `<button onclick="validarAgroquimico('estadoAgroA3')">Validar</button>` : 
              `<span class="tag info">Solo consulta</span>`
            }
          </td>
        </tr>

        <tr>
          <td>22/05/2026</td>
          <td>B2</td>
          <td>Fertilizante floral</td>
          <td>Capataz</td>
          <td id="estadoAgroB2"><span class="tag ok">Registrado</span></td>
          <td>
            ${currentRole === "agronomo" || currentRole === "socios" ? 
              `<button onclick="validarAgroquimico('estadoAgroB2')">Validar</button>` : 
              `<span class="tag info">Solo consulta</span>`
            }
          </td>
        </tr>
      </table>
    </div>
  `;
}

function validarAgroquimico(idEstado){
  document.getElementById(idEstado).innerHTML = `<span class="tag ok">Validado</span>`;

  alert(
    "✅ Aplicación validada correctamente.\n\n" +
    "El registro queda confirmado para la trazabilidad del lote."
  );
}

function renderLotes(){
  document.getElementById("view-lotes").innerHTML = `
    <div class="card">
      <h3>Historial por lote</h3>
      <p>Permite consultar y exportar la información histórica de un lote específico.</p>

      <div class="grid form-grid">
        <select id="loteHistorial">
          <option value="A3">Lote A3</option>
          <option value="B2">Lote B2</option>
          <option value="C1">Lote C1</option>
        </select>

        <button onclick="exportarHistorialLote()">
          Exportar historial del lote
        </button>
      </div>

      <table style="margin-top:18px">
        <tr>
          <th>Lote</th>
          <th>Último monitoreo</th>
          <th>Plagas</th>
          <th>Floración</th>
          <th>Última acción</th>
          <th>Producción estimada</th>
        </tr>
        <tr>
          <td>A3</td>
          <td>26/05/2026</td>
          <td>Trips del kiwi</td>
          <td>40%</td>
          <td>Planificar polinización</td>
          <td>18.5 tn</td>
        </tr>
        <tr>
          <td>B2</td>
          <td>26/05/2026</td>
          <td>Araña roja</td>
          <td>28%</td>
          <td>Revisar en 48 hs</td>
          <td>12.2 tn</td>
        </tr>
        <tr>
          <td>C1</td>
          <td>25/05/2026</td>
          <td>Sin detección</td>
          <td>15%</td>
          <td>Esperar nuevo monitoreo</td>
          <td>8.7 tn</td>
        </tr>
      </table>

      <div class="actions">
        <button class="secondary" onclick="fakeSave('Registros importados desde Excel')">
          Importar Excel
        </button>
        <button onclick="exportarHistorialLote()">
          Exportar registros
        </button>
      </div>
    </div>
  `;
}

function exportarHistorialLote(){
  const lote = document.getElementById("loteHistorial").value;

  const historiales = {
    A3: `
HISTORIAL DEL LOTE A3 - IKIWI

Último monitoreo: 26/05/2026
Imagen procesada: IMG-A3-0526.jpg
Plaga detectada: Trips del kiwi
Severidad: Alta
Floración detectada por IA: 40%
Estado: Listo para polinización
Recomendación: Planificar polinización
Producción estimada: 18.5 tn

ACTIVIDADES REGISTRADAS
- Poda realizada
- Monitoreo con dron
- Detección de plaga por IA
- Validación del Ingeniero Agrónomo
- Planificación de polinización

TRAZABILIDAD
- Agroquímico sugerido: Insecticida específico
- Responsable técnico: Ingeniero Agrónomo
- Estado del lote: Requiere tratamiento y seguimiento
`,
    B2: `
HISTORIAL DEL LOTE B2 - IKIWI

Último monitoreo: 26/05/2026
Imagen procesada: IMG-B2-0526.jpg
Plaga detectada: Araña roja
Severidad: Media
Floración detectada por IA: 28%
Estado: Seguimiento
Recomendación: Revisar en 48 hs
Producción estimada: 12.2 tn

ACTIVIDADES REGISTRADAS
- Monitoreo con dron
- Seguimiento de floración
- Control sanitario preventivo

TRAZABILIDAD
- Responsable técnico: Ingeniero Agrónomo
- Estado del lote: En observación
`,
    C1: `
HISTORIAL DEL LOTE C1 - IKIWI

Último monitoreo: 25/05/2026
Imagen procesada: IMG-C1-0525.jpg
Plaga detectada: Sin detección
Floración detectada por IA: 15%
Estado: Temprano
Recomendación: Esperar nuevo monitoreo
Producción estimada: 8.7 tn

ACTIVIDADES REGISTRADAS
- Monitoreo con dron
- Registro de floración temprana
- Seguimiento preventivo

TRAZABILIDAD
- Responsable técnico: Ingeniero Agrónomo
- Estado del lote: Normal
`
  };

  const contenido = historiales[lote];

  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "historial_lote_" + lote + ".txt";
  link.click();

  URL.revokeObjectURL(url);
}

function renderTiempo(){
  const opciones = actividadesAgricolas.map(a => `<option>${a.titulo}</option>`).join("");

  document.getElementById("view-tiempo").innerHTML = `
    <div class="grid two">
      <div class="card">
        <h3>Registrar tiempo de trabajo en campo</h3>
        <div class="grid form-grid">
          <input id="operarioTrabajo" placeholder="Operario" value="Operario 01">
          <select id="actividadTrabajo">
            <option value="">Seleccionar actividad</option>
            ${opciones}
          </select>
          <select id="loteTrabajo">
            <option>Lote A3</option>
            <option>Lote B2</option>
            <option>Lote C1</option>
            <option>Lote D4</option>
            <option>General</option>
          </select>
          <input id="horasTrabajo" type="number" placeholder="Horas trabajadas" value="3" min="1">
          <input id="fechaTrabajo" type="date">
          <textarea id="obsTrabajo" placeholder="Observaciones">Actividad realizada sin inconvenientes.</textarea>
          <button onclick="registrarTiempoTrabajo()">Registrar</button>
        </div>
      </div>

      <div class="card">
        <h3>Registrar combustible utilizado</h3>
        <p>Registro del consumo de combustible en recorridos terrestres asociados a un lote.</p>

        <div class="grid form-grid">
          <input id="vehiculoCombustible" placeholder="Vehículo" value="Camioneta 01">

          <select id="loteCombustible">
            <option>Lote A3</option>
            <option>Lote B2</option>
            <option>Lote C1</option>
            <option>Lote D4</option>
            <option>General</option>
          </select>

          <input id="litrosCombustible" type="number" placeholder="Litros consumidos" value="12" min="1">
          <input id="fechaCombustible" type="date">

          <button onclick="registrarCombustible()">Registrar combustible</button>
        </div>
      </div>
    </div>

    <div class="grid two" style="margin-top:18px">
      <div class="card">
        <h3>Indicadores operativos</h3>
        <div class="kpi-line"><b>Horas terrestres registradas</b><span>128 hs</span></div>
        <div class="kpi-line"><b>Combustible utilizado</b><span id="totalCombustible">120 L</span></div>
        <div class="kpi-line"><b>Actividades disponibles</b><span>${actividadesAgricolas.length}</span></div>
        <div class="kpi-line"><b>Cobertura operativa</b><span>96%</span></div>
      </div>

      <div class="card">
        <h3>Comparación de monitoreo</h3>
        <div class="kpi-line"><b>Recorridos terrestres</b><span>8</span></div>
        <div class="kpi-line"><b>Recorridos con dron</b><span>12</span></div>
        <div class="kpi-line"><b>Imágenes procesadas</b><span>384</span></div>
        <div class="kpi-line"><b>Ahorro estimado</b><span>28%</span></div>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Últimos registros de trabajo</h3>
      <table id="tablaTiempo">
        <tr><th>Fecha</th><th>Operario</th><th>Actividad</th><th>Lote</th><th>Horas</th><th>Estado</th></tr>
        <tr><td>26/05/2026</td><td>Operario 01</td><td>Poda</td><td>A3</td><td>3 hs</td><td><span class="tag ok">Registrado</span></td></tr>
        <tr><td>26/05/2026</td><td>Operario 02</td><td>Monitoreo de riego</td><td>B2</td><td>2 hs</td><td><span class="tag ok">Registrado</span></td></tr>
        <tr><td>25/05/2026</td><td>Operario 03</td><td>Control de heladas</td><td>C1</td><td>4 hs</td><td><span class="tag ok">Registrado</span></td></tr>
        <tr><td>25/05/2026</td><td>Capataz 01</td><td>Combustible utilizado</td><td>General</td><td>1 hs</td><td><span class="tag ok">Registrado</span></td></tr>
      </table>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Últimos registros de combustible</h3>
      <table id="tablaCombustible">
        <tr><th>Fecha</th><th>Vehículo</th><th>Lote</th><th>Litros</th><th>Estado</th></tr>
        <tr><td>26/05/2026</td><td>Camioneta 01</td><td>A3</td><td>12 L</td><td><span class="tag ok">Registrado</span></td></tr>
        <tr><td>25/05/2026</td><td>Tractor 02</td><td>B2</td><td>18 L</td><td><span class="tag ok">Registrado</span></td></tr>
        <tr><td>24/05/2026</td><td>Camioneta 02</td><td>General</td><td>90 L</td><td><span class="tag ok">Registrado</span></td></tr>
      </table>
    </div>
  `;
}

function registrarTiempoTrabajo(){
  const actividad = document.getElementById("actividadTrabajo").value;
  const operario = document.getElementById("operarioTrabajo").value || "Sin asignar";
  const lote = document.getElementById("loteTrabajo").value;
  const horas = document.getElementById("horasTrabajo").value || "0";
  const fecha = document.getElementById("fechaTrabajo").value || new Date().toLocaleDateString("es-AR");

  if(!actividad){
    alert("Seleccioná una actividad antes de registrar.");
    return;
  }

  const tabla = document.getElementById("tablaTiempo");
  const fila = tabla.insertRow(1);
  fila.innerHTML = `
    <td>${fecha}</td>
    <td>${operario}</td>
    <td>${actividad}</td>
    <td>${lote}</td>
    <td>${horas} hs</td>
    <td><span class="tag ok">Registrado</span></td>
  `;

  alert("✅ Tiempo de trabajo registrado para la actividad: " + actividad);
}

function registrarCombustible(){
  const vehiculo = document.getElementById("vehiculoCombustible").value || "Sin vehículo";
  const lote = document.getElementById("loteCombustible").value;
  const litros = document.getElementById("litrosCombustible").value || "0";
  const fecha = document.getElementById("fechaCombustible").value || new Date().toLocaleDateString("es-AR");

  const tabla = document.getElementById("tablaCombustible");
  const fila = tabla.insertRow(1);

  fila.innerHTML = `
    <td>${fecha}</td>
    <td>${vehiculo}</td>
    <td>${lote}</td>
    <td>${litros} L</td>
    <td><span class="tag ok">Registrado</span></td>
  `;

  document.getElementById("totalCombustible").textContent = "Actualizado";

  alert(
    "✅ Combustible registrado correctamente.\n\n" +
    "Vehículo: " + vehiculo + "\n" +
    "Lote: " + lote + "\n" +
    "Litros consumidos: " + litros + " L\n" +
    "Fecha: " + fecha
  );
}

function registrarTiempoTrabajo(){
  const actividad = document.getElementById("actividadTrabajo").value;
  const operario = document.getElementById("operarioTrabajo").value || "Sin asignar";
  const lote = document.getElementById("loteTrabajo").value;
  const horas = document.getElementById("horasTrabajo").value || "0";
  const fecha = document.getElementById("fechaTrabajo").value || new Date().toLocaleDateString("es-AR");

  if(!actividad){
    alert("Seleccioná una actividad antes de registrar.");
    return;
  }

  const tabla = document.getElementById("tablaTiempo");
  const fila = tabla.insertRow(1);
  fila.innerHTML = `
    <td>${fecha}</td>
    <td>${operario}</td>
    <td>${actividad}</td>
    <td>${lote}</td>
    <td>${horas} hs</td>
    <td><span class="tag ok">Registrado</span></td>
  `;

  alert("✅ Tiempo de trabajo registrado para la actividad: " + actividad);
}

function renderReportes(){
  document.getElementById("view-reportes").innerHTML = `
    <div class="card">
      <h3>Generar reporte automatizado de monitoreo</h3>
      <div class="grid form-grid">
        <select><option>Todos los lotes</option><option>Lote A3</option><option>Lote B2</option></select>
        <input type="date">
        <select><option>PDF</option><option>Excel</option></select>
        <button onclick="generarReporte()">Generar y descargar reporte</button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Reportes disponibles con datos cargados</h3>
      <table>
        <tr><th>Reporte</th><th>Contenido</th><th>Permiso</th><th>Acción</th></tr>
        <tr><td>Monitoreo diario</td><td>Plagas, floración detectada por imágenes de dron, mapas y recomendaciones IA</td><td><span class="role-pill">Socios/Admin/Contable</span></td><td><button onclick="generarReporte()">Descargar</button></td></tr>
        <tr><td>Trazabilidad exportación</td><td>Agroquímicos y auditoría</td><td><span class="role-pill">Socios/Admin/Contable</span></td><td><button onclick="generarReporte()">Descargar</button></td></tr>
      </table>
    </div>
  `;
}

function renderDecisiones(){
  document.getElementById("view-decisiones").innerHTML = `
    <div class="grid cards">
      <div class="card animated-card"><h3>Riesgo productivo</h3><div class="metric pulse-number">Medio</div><p>Por plaga crítica localizada</p></div>
      <div class="card animated-card"><h3>Cosecha estimada</h3><div class="metric">58 tn</div><p>Según floración actual</p></div>
      <div class="card animated-card"><h3>Costo operativo</h3><div class="metric">-18%</div><p>Proyección mensual</p></div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Informe para toma de decisiones</h3>
      <p>El sistema recomienda priorizar tratamiento en A3, reforzar monitoreo en B2 y planificar polinización del lote A3 por superar el 40% de apertura floral.</p>
      <div class="actions">
        <button onclick="generarReporte()">Exportar informe gerencial</button>
        <button class="secondary">Compartir con socios</button>
      </div>
    </div>
  `;
}

function renderAdmin(){
  document.getElementById("view-admin").innerHTML = `
    <div class="card">
      <h3>Matriz de permisos del prototipo</h3>
      <table>
        <tr><th>Rol</th><th>Permisos principales</th></tr>
        ${Object.entries(roles).map(([key, role]) => `
          <tr>
            <td>${role.label}</td>
            <td>${role.access === "all" ? "Acceso total a todas las funcionalidades" : role.access.join(", ")}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
}

function generarReporte(){
  const rolesPermitidos = ["socios", "administrativo", "contable"];

  if(!rolesPermitidos.includes(currentRole)){
    alert("Acceso denegado. Solo Socios/Accionistas, Personal Administrativo y Personal Contable pueden descargar reportes.");
    return;
  }

  const contenido = `
REPORTE AUTOMATIZADO DE MONITOREO - IKIWI

Usuario: ${currentUser}
Rol: ${roles[currentRole].label}
Fecha: ${new Date().toLocaleDateString("es-AR")}

RESUMEN GENERAL
- Lotes monitoreadas: 146
- Alertas activas: 4
- Floración promedio: 42%
- Ahorro estimado de combustible: 28%

PLAGAS DETECTADAS
- Trips del kiwi | Lote A3 | Severidad alta | Confianza IA: 94%
- Araña roja | Lote B2 | Severidad media | Confianza IA: 87%

FLORACIÓN
- Lote A3: 40% | Listo para polinización
- Lote B2: 28% | Seguimiento
- Lote C1: 15% | Estado temprano

ACTIVIDADES OPERATIVAS
- Poda
- Atada
- Despunte
- Raleo previo a polinización
- Polinización
- Raleo post polinización
- Poda en verde
- Cosecha
- Aplicación de agroquímicos
- Monitoreo de riego
- Control de maleza
- Control de heladas
- Combustible utilizado

RECOMENDACIONES
- Aplicar tratamiento en Lote A3 dentro de las próximas 24-48 hs.
- Aumentar frecuencia de monitoreo en lotes adyacentes.
- Planificar polinización del Lote A3.
`;

  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reporte_ikiwi_monitoreo.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function fakeSave(msg){
  alert("✅ " + msg);
}

document.addEventListener("DOMContentLoaded", () => {
  saveUsers();

  document.getElementById("tabLogin").addEventListener("click", () => switchAuth("login"));
  document.getElementById("tabRegister").addEventListener("click", () => switchAuth("register"));
  document.getElementById("registerPassword").addEventListener("input", updatePasswordRules);
  document.getElementById("registerForm").addEventListener("submit", registerAccount);
  document.getElementById("loginForm").addEventListener("submit", login);
});
