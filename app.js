const roles = {
  socios: { label: "Socios / Dueños / Accionistas", access: "all" },
  capataz: { label: "Capataz de Campo", access: ["dashboard","drones","plagas","floracion","lotes","tiempo","reportes"] },
  agronomo: { label: "Técnico Agrónomo", access: ["dashboard","plagas","floracion","agroquimicos","lotes","reportes"] },
  operario: { label: "Operario Agrícola", access: ["dashboard","drones","tiempo","lotes"] },
  administrativo: { label: "Personal Administrativo", access: ["dashboard","agroquimicos","lotes","reportes"] },
  contable: { label: "Personal Contable", access: ["dashboard","tiempo","reportes","decisiones"] }
};

const pages = [
  ["dashboard","Tablero general","📊"],
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

const actividadesAgricolas = [
  {
    titulo: "Poda",
    icono: "✂️",
    detalle: "Eliminación de ramas innecesarias para mejorar la ventilación, entrada de luz y productividad del cultivo.",
    responsable: "Capataz / Operario",
    etapa: "Manejo del cultivo",
    registro: "Fecha, lote, responsable, observaciones y horas trabajadas."
  },
  {
    titulo: "Atada",
    icono: "🌿",
    detalle: "Sujeción de ramas o guías a la estructura de soporte para ordenar el crecimiento de la planta.",
    responsable: "Operario Agrícola",
    etapa: "Formación de estructura",
    registro: "Lote, cantidad de plantas intervenidas y tiempo empleado."
  },
  {
    titulo: "Despunte",
    icono: "🌱",
    detalle: "Corte de brotes para controlar el crecimiento vegetativo y favorecer el desarrollo productivo.",
    responsable: "Capataz / Operario",
    etapa: "Manejo vegetativo",
    registro: "Lote, sector, fecha y observaciones."
  },
  {
    titulo: "Raleo previo a polinización",
    icono: "🌼",
    detalle: "Selección previa de flores o estructuras para mejorar la calidad del fruto futuro antes de la polinización.",
    responsable: "Técnico Agrónomo / Capataz",
    etapa: "Pre-polinización",
    registro: "Porcentaje de avance, lote y criterio aplicado."
  },
  {
    titulo: "Polinización",
    icono: "🐝",
    detalle: "Proceso de transferencia de polen para asegurar la formación del fruto.",
    responsable: "Técnico Agrónomo / Capataz",
    etapa: "Floración",
    registro: "Lote, fecha, porcentaje de flor abierta y condiciones climáticas."
  },
  {
    titulo: "Raleo post polinización",
    icono: "🥝",
    detalle: "Eliminación de frutos excedentes para mejorar tamaño, calidad y uniformidad de la cosecha.",
    responsable: "Operario / Capataz",
    etapa: "Post-polinización",
    registro: "Cantidad estimada de frutos removidos y lote intervenido."
  },
  {
    titulo: "Poda en verde",
    icono: "🍃",
    detalle: "Poda realizada durante el crecimiento activo para controlar exceso de vegetación.",
    responsable: "Capataz / Operario",
    etapa: "Crecimiento",
    registro: "Lote, sector, fecha y observaciones."
  },
  {
    titulo: "Cosecha",
    icono: "🧺",
    detalle: "Recolección de kiwis según madurez, calidad y planificación comercial.",
    responsable: "Capataz / Operario",
    etapa: "Producción",
    registro: "Kilos cosechados, lote, fecha y destino."
  },
  {
    titulo: "Aplicación de agroquímicos",
    icono: "🧪",
    detalle: "Registro de productos aplicados para control sanitario y trazabilidad de exportación.",
    responsable: "Técnico Agrónomo",
    etapa: "Sanidad vegetal",
    registro: "Producto, dosis, lote, fecha, responsable y receta."
  },
  {
    titulo: "Monitoreo de riego",
    icono: "💧",
    detalle: "Control del estado hídrico del cultivo mediante sensores o registros de campo.",
    responsable: "Capataz / Técnico Agrónomo",
    etapa: "Riego",
    registro: "Humedad, lote, alertas y recomendaciones."
  },
  {
    titulo: "Control de maleza",
    icono: "🌾",
    detalle: "Seguimiento y control de malezas que compiten con el cultivo por agua y nutrientes.",
    responsable: "Operario / Capataz",
    etapa: "Mantenimiento",
    registro: "Sector afectado, método de control y fecha."
  },
  {
    titulo: "Control de heladas",
    icono: "❄️",
    detalle: "Monitoreo de temperatura y activación de medidas preventivas ante riesgo de heladas.",
    responsable: "Capataz / Técnico Agrónomo",
    etapa: "Prevención climática",
    registro: "Temperatura, lote, alerta y acción tomada."
  },
  {
    titulo: "Combustible utilizado",
    icono: "⛽",
    detalle: "Registro del combustible consumido en recorridos, maquinaria o tareas operativas.",
    responsable: "Personal Contable / Capataz",
    etapa: "Control operativo",
    registro: "Litros, vehículo, actividad, lote y responsable."
  }
];

let currentRole = "";
let currentUser = "";

let registeredUsers = JSON.parse(localStorage.getItem("ikiwiUsers")) || [
  { name: "Socio Demo", email: "socio@ikiwi.com", password: "Ikiwi@123", role: "socios" },
  { name: "Administrativo Demo", email: "admin@ikiwi.com", password: "Ikiwi@123", role: "administrativo" },
  { name: "Contable Demo", email: "contable@ikiwi.com", password: "Ikiwi@123", role: "contable" }
];

saveUsers();

function saveUsers() {
  localStorage.setItem("ikiwiUsers", JSON.stringify(registeredUsers));
}

function validateInstitutionalEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@ikiwi\.com$/.test(email);
}

function validatePassword(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

function isStrongPassword(password) {
  const rules = validatePassword(password);
  return rules.length && rules.upper && rules.lower && rules.special;
}

function showMessage(id, text) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
  element.classList.remove("hidden");
}

function hideMessage(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add("hidden");
  element.textContent = "";
}

function switchAuth(mode) {
  const isLogin = mode === "login";
  document.getElementById("loginForm").classList.toggle("hidden", !isLogin);
  document.getElementById("registerForm").classList.toggle("hidden", isLogin);
  document.getElementById("tabLogin").classList.toggle("active", isLogin);
  document.getElementById("tabRegister").classList.toggle("active", !isLogin);

  hideMessage("loginError");
  hideMessage("registerError");
  hideMessage("registerSuccess");
}

function updatePasswordRules() {
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
    if (!item) return;
    item.classList.toggle("valid", valid);
    item.classList.toggle("invalid", password.length > 0 && !valid);
  });
}

function registerAccount(event) {
  event.preventDefault();

  hideMessage("registerError");
  hideMessage("registerSuccess");

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  if (name.length < 3) {
    showMessage("registerError", "Ingresá nombre y apellido.");
    return;
  }

  if (!validateInstitutionalEmail(email)) {
    showMessage("registerError", "El mail debe ser institucional y terminar en @ikiwi.com");
    return;
  }

  if (!isStrongPassword(password)) {
    showMessage("registerError", "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.");
    return;
  }

  if (registeredUsers.some(user => user.email === email)) {
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
  showMessage("loginError", "Cuenta creada correctamente. Ahora ingresá tu contraseña para iniciar sesión.");
}

function login(event) {
  event.preventDefault();

  hideMessage("loginError");

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if (!validateInstitutionalEmail(email)) {
    showMessage("loginError", "El mail debe terminar en @ikiwi.com");
    return;
  }

  const account = registeredUsers.find(user => user.email === email && user.password === password);

  if (!account) {
    showMessage("loginError", "Mail o contraseña incorrectos. Primero creá una cuenta o revisá los datos.");
    return;
  }

  currentRole = account.role;
  currentUser = account.name;

  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  document.getElementById("roleName").textContent = roles[currentRole].label;
  document.getElementById("welcome").textContent =
    `Hola ${currentUser}. Rol detectado automáticamente: ${roles[currentRole].label}.`;

  buildMenu();
  renderAll();
  showPage("dashboard");
}

function logout() {
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("loginPassword").value = "";
  currentRole = "";
  currentUser = "";
}

function can(pageId) {
  const roleConfig = roles[currentRole];
  if (!roleConfig) return false;
  if (roleConfig.access === "all") return true;
  return roleConfig.access.includes(pageId);
}

function buildMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  pages.forEach(([id, title, icon]) => {
    if (can(id)) {
      const button = document.createElement("button");
      button.className = "nav-btn";
      button.id = "nav-" + id;
      button.innerHTML = `${icon} ${title}`;
      button.onclick = () => showPage(id);
      menu.appendChild(button);
    }
  });
}

function showPage(id) {
  pages.forEach(([pageId]) => {
    const view = document.getElementById("view-" + pageId);
    const nav = document.getElementById("nav-" + pageId);

    if (view) view.classList.add("hidden");
    if (nav) nav.classList.remove("active");
  });

  if (!can(id)) {
    blocked(id);
    return;
  }

  document.getElementById("view-" + id).classList.remove("hidden");
  document.getElementById("pageTitle").textContent = pages.find(page => page[0] === id)[1];

  const activeNav = document.getElementById("nav-" + id);
  if (activeNav) activeNav.classList.add("active");
}

function blocked(id) {
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

function setOffline() {
  const dot = document.getElementById("syncDot");
  const text = document.getElementById("syncText");
  if (!dot || !text) return;

  const offline = Math.random() < 0.25;
  dot.style.background = offline ? "#d68910" : "#1e8449";
  text.textContent = offline ? "Modo offline · datos locales" : "Sincronizado";
}

setInterval(setOffline, 5000);

function renderAll() {
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

function renderDashboard() {
  document.getElementById("view-dashboard").innerHTML = `
    <div class="alert-strip">
      ⚠️ Alerta crítica: Trips del kiwi detectado en Lote A3. Se recomienda tratamiento en 24-48 hs.
    </div>

    <div class="grid cards">
      <div class="card animated-card">
        <h3>Hectáreas monitoreadas</h3>
        <div class="metric pulse-number">146</div>
        <p>Centralizadas por lote</p>
      </div>

      <div class="card animated-card">
        <h3>Alertas activas</h3>
        <div class="metric pulse-number">4</div>
        <p>2 críticas · 1 media · 1 baja</p>
      </div>

      <div class="card animated-card">
        <h3>Ahorro estimado combustible</h3>
        <div class="metric pulse-number">28%</div>
        <p>Por reemplazo de recorridos terrestres</p>
      </div>

      <div class="card animated-card">
        <h3>Floración promedio</h3>
        <div class="metric pulse-number">42%</div>
        <p>Base para predicción de cosecha</p>
      </div>
    </div>

    <div class="grid two" style="margin-top:18px">
      <div class="card">
        <h3>Mapa sanitario en tiempo real</h3>
        <div class="satellite-map">
          <div class="scan-line"></div>
          <div class="map-road road-1"></div>
          <div class="map-road road-2"></div>
          <span class="parcel p1">Lote A3</span>
          <span class="parcel p2">Lote B2</span>
          <span class="parcel p3">Lote C1</span>
          <span class="parcel p4">Lote D4</span>
          <span class="drone-marker">🚁</span>
          <span class="hotspot red" style="width:86px;height:86px;left:22%;top:38%"></span>
          <span class="hotspot orange" style="width:66px;height:66px;left:62%;top:28%"></span>
          <span class="hotspot yellow" style="width:50px;height:50px;left:76%;top:66%"></span>
        </div>
      </div>

      <div class="card">
        <h3>Solución a la problemática</h3>
        <div class="kpi-line"><b>Información dispersa</b><span class="tag ok">Centralizada</span></div>
        <div class="kpi-line"><b>Recorridos manuales</b><span class="tag ok">Drones</span></div>
        <div class="kpi-line"><b>Detección tardía</b><span class="tag ok">IA + alertas</span></div>
        <div class="kpi-line"><b>Trazabilidad exportación</b><span class="tag ok">100% digital</span></div>

        <div class="mini-chart">
          <span style="--target:65px"></span>
          <span style="--target:105px"></span>
          <span style="--target:82px"></span>
          <span style="--target:115px"></span>
          <span style="--target:92px"></span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Procesos operativos del cultivo</h3>
      <p>Seleccioná una actividad para ver el detalle y registrar información operativa.</p>

      <div class="activity-buttons">
        ${actividadesAgricolas.map((actividad, index) => `
          <button class="activity-btn" onclick="verDetalleActividad(${index})">
            <span>${actividad.icono}</span>
            ${actividad.titulo}
          </button>
        `).join("")}
      </div>
    </div>

    <div id="detalleActividad"></div>
  `;
}

function verDetalleActividad(index) {
  const actividad = actividadesAgricolas[index];
  const detalle = document.getElementById("detalleActividad");

  detalle.innerHTML = `
    <div class="card detalle-actividad">
      <h2>${actividad.icono} ${actividad.titulo}</h2>

      <p><b>Descripción:</b> ${actividad.detalle}</p>
      <p><b>Responsable:</b> ${actividad.responsable}</p>
      <p><b>Etapa del cultivo:</b> ${actividad.etapa}</p>
      <p><b>Registro que debe guardar el sistema:</b> ${actividad.registro}</p>

      <div class="grid form-grid">
        <select>
          <option>Lote A3</option>
          <option>Lote B2</option>
          <option>Lote C1</option>
          <option>Lote D4</option>
        </select>
        <input type="date">
        <input placeholder="Responsable" value="${actividad.responsable}">
        <textarea placeholder="Observaciones">Actividad registrada desde tablero principal.</textarea>
      </div>

      <div class="actions">
        <button onclick="fakeSave('Registro de ${actividad.titulo} guardado correctamente')">
          Registrar actividad
        </button>

        <button class="secondary" onclick="document.getElementById('detalleActividad').innerHTML = ''">
          Cerrar detalle
        </button>
      </div>
    </div>
  `;

  detalle.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDrones() {
  document.getElementById("view-drones").innerHTML = `
    <div class="grid cards">
      <div class="card">
        <h3>Último recorrido</h3>
        <div class="metric">CU003</div>
        <p>Dron DJI-KW-02 · Sierra de los Padres</p>
      </div>

      <div class="card">
        <h3>Procesamiento IA</h3>
        <div class="metric">78%</div>
        <p>RNF03: máximo 2 horas</p>
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
        </select>
        <input type="datetime-local">
        <button onclick="fakeSave('Recorrido registrado y enviado a procesamiento')">Guardar recorrido</button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Estado de misiones</h3>
      <table>
        <tr><th>Recorrido</th><th>Lote</th><th>Estado</th><th>Resultado</th></tr>
        <tr><td>REC-0526-A3</td><td>A3</td><td><span class="tag warn">Procesando</span></td><td>Mapa preliminar</td></tr>
        <tr><td>REC-0526-B2</td><td>B2</td><td><span class="tag ok">Finalizado</span></td><td>2 alertas</td></tr>
      </table>
    </div>
  `;
}

function renderPlagas() {
  document.getElementById("view-plagas").innerHTML = `
    <div class="grid cards">
      <div class="card"><h3>Crítico</h3><div class="metric">1</div><p>Alta severidad</p></div>
      <div class="card"><h3>Atención</h3><div class="metric">2</div><p>Severidad media</p></div>
      <div class="card"><h3>Bajo control</h3><div class="metric">1</div><p>Severidad baja</p></div>
      <div class="card"><h3>Áreas afectadas</h3><div class="metric">5.6</div><p>Hectáreas</p></div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Detecciones recientes</h3>
      <div class="list">
        <div class="item">
          <header><b>Trips del kiwi · Lote A3</b><span class="tag danger">alta</span></header>
          <p>Confianza IA: 94% · Área afectada: 2.3 ha · Coord: 37.9872°S, 57.7654°W</p>
          <p><b>Recomendación:</b> aplicar insecticida específico en 24-48 hs y monitorear lotes adyacentes.</p>
          <div class="actions">
            <button>Ver en mapa</button>
            <button class="secondary">Programar tratamiento</button>
            <button class="secondary">Exportar informe</button>
          </div>
        </div>

        <div class="item">
          <header><b>Araña roja · Lote B2</b><span class="tag warn">media</span></header>
          <p>Confianza IA: 87% · Área afectada: 1.1 ha · Detectado: 2026-05-26 11:30</p>
        </div>
      </div>
    </div>
  `;
}

function renderFloracion() {
  document.getElementById("view-floracion").innerHTML = `
    <div class="grid two">
      <div class="card">
        <h3>Floración por lote</h3>
        <table>
          <tr><th>Lote</th><th>Apertura floral</th><th>Estado</th><th>Acción</th></tr>
          <tr><td>A3</td><td>40%</td><td><span class="tag ok">Listo para polinización</span></td><td>Planificar</td></tr>
          <tr><td>B2</td><td>28%</td><td><span class="tag warn">Seguimiento</span></td><td>Revisar 48 hs</td></tr>
          <tr><td>C1</td><td>15%</td><td><span class="tag info">Temprano</span></td><td>Esperar</td></tr>
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
        <p>Reporte predictivo basado en apertura floral por lote.</p>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Registrar información de floración</h3>
      <div class="grid form-grid">
        <select><option>Lote A3</option><option>Lote B2</option></select>
        <input type="number" placeholder="% flor abierta" value="40">
        <textarea placeholder="Observaciones">Floración uniforme. Iniciar polinización si el clima acompaña.</textarea>
        <button onclick="fakeSave('Floración registrada por lote')">Registrar</button>
      </div>
    </div>
  `;
}

function renderAgro() {
  document.getElementById("view-agroquimicos").innerHTML = `
    <div class="card">
      <h3>Registrar uso de agroquímicos / fertilizantes</h3>
      <div class="grid form-grid">
        <select><option>Lote A3</option><option>Lote B2</option></select>
        <input placeholder="Producto" value="Insecticida específico">
        <input placeholder="Dosis" value="1.2 L/ha">
        <input type="date">
        <button onclick="fakeSave('Aplicación fitosanitaria registrada para trazabilidad')">Guardar aplicación</button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Trazabilidad digital para auditorías</h3>
      <table>
        <tr><th>Fecha</th><th>Lote</th><th>Producto</th><th>Responsable</th><th>Estado</th></tr>
        <tr><td>26/05/2026</td><td>A3</td><td>Insecticida específico</td><td>Téc. Agrónomo</td><td><span class="tag ok">Auditado</span></td></tr>
        <tr><td>22/05/2026</td><td>B2</td><td>Fertilizante floral</td><td>Capataz</td><td><span class="tag ok">Registrado</span></td></tr>
      </table>
    </div>
  `;
}

function renderLotes() {
  document.getElementById("view-lotes").innerHTML = `
    <div class="card">
      <h3>Historial de producción por lote</h3>
      <table>
        <tr><th>Lote</th><th>Último monitoreo</th><th>Plagas</th><th>Floración</th><th>Producción estimada</th></tr>
        <tr><td>A3</td><td>26/05/2026</td><td>Trips</td><td>40%</td><td>18.5 tn</td></tr>
        <tr><td>B2</td><td>26/05/2026</td><td>Araña roja</td><td>28%</td><td>12.2 tn</td></tr>
        <tr><td>C1</td><td>25/05/2026</td><td>Sin detección</td><td>15%</td><td>8.7 tn</td></tr>
      </table>

      <div class="actions">
        <button class="secondary" onclick="fakeSave('Registros importados desde Excel')">Importar Excel</button>
        <button>Exportar registros</button>
      </div>
    </div>
  `;
}

function renderTiempo() {
  document.getElementById("view-tiempo").innerHTML = `
    <div class="grid two">
      <div class="card">
        <h3>Registrar tiempo de trabajo en campo</h3>
        <div class="grid form-grid">
          <input placeholder="Operario" value="Operario 01">
          <select><option>Monitoreo terrestre</option><option>Soporte dron</option><option>Aplicación agroquímicos</option></select>
          <input type="number" placeholder="Horas" value="3">
          <button onclick="fakeSave('Tiempo de trabajo registrado')">Registrar</button>
        </div>
      </div>

      <div class="card">
        <h3>Indicadores operativos</h3>
        <div class="kpi-line"><b>Horas terrestres evitadas</b><span>36 hs</span></div>
        <div class="kpi-line"><b>Combustible estimado ahorrado</b><span>120 L</span></div>
        <div class="kpi-line"><b>Cobertura por dron</b><span>96%</span></div>
      </div>
    </div>
  `;
}

function renderReportes() {
  document.getElementById("view-reportes").innerHTML = `
    <div class="card">
      <h3>Generar reporte automatizado de monitoreo</h3>
      <p>La descarga está habilitada solo para Socios/Dueños, Personal Administrativo y Personal Contable.</p>
      <div class="grid form-grid">
        <select><option>Todos los lotes</option><option>Lote A3</option><option>Lote B2</option></select>
        <input type="date">
        <select><option>PDF simulado TXT</option><option>Excel simulado CSV</option></select>
        <button onclick="generarReporte()">Generar y descargar reporte</button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Reportes disponibles</h3>
      <table>
        <tr><th>Reporte</th><th>Contenido</th><th>Permiso</th><th>Acción</th></tr>
        <tr><td>Monitoreo diario</td><td>Plagas, floración, mapas</td><td><span class="role-pill">Admin / Contable / Socios</span></td><td><button onclick="generarReporte()">Descargar</button></td></tr>
        <tr><td>Trazabilidad exportación</td><td>Agroquímicos y auditoría</td><td><span class="role-pill">Admin / Contable / Socios</span></td><td><button onclick="generarReporte()">Descargar</button></td></tr>
      </table>
    </div>
  `;
}

function renderDecisiones() {
  document.getElementById("view-decisiones").innerHTML = `
    <div class="grid cards">
      <div class="card">
        <h3>Riesgo productivo</h3>
        <div class="metric">Medio</div>
        <p>Por plaga crítica localizada</p>
      </div>

      <div class="card">
        <h3>Cosecha estimada</h3>
        <div class="metric">58 tn</div>
        <p>Predicción según floración actual, sanidad del cultivo e historial por lote.</p>
      </div>

      <div class="card">
        <h3>Costo operativo</h3>
        <div class="metric">-18%</div>
        <p>Proyección mensual</p>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <h3>Informe para toma de decisiones</h3>
      <p>
        El sistema recomienda priorizar tratamiento en A3, reforzar monitoreo en B2
        y planificar polinización del lote A3 por superar el 40% de apertura floral.
      </p>
      <div class="actions">
        <button onclick="generarReporte()">Exportar informe gerencial</button>
        <button class="secondary">Compartir con socios</button>
      </div>
    </div>
  `;
}

function renderAdmin() {
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

function generarReporte() {
  const rolesPermitidos = ["socios", "administrativo", "contable"];

  if (!rolesPermitidos.includes(currentRole)) {
    alert("Acceso denegado. Solo Socios/Dueños, Personal Administrativo y Personal Contable pueden descargar reportes.");
    return;
  }

  const contenido = `
REPORTE AUTOMATIZADO DE MONITOREO - IKIWI

Usuario: ${currentUser}
Rol: ${roles[currentRole].label}
Fecha: ${new Date().toLocaleDateString()}

RESUMEN GENERAL
- Hectáreas monitoreadas: 146
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

PROCESOS OPERATIVOS
- Poda, atada, despunte y poda en verde registrados por lote.
- Monitoreo de riego, control de maleza y control de heladas disponibles en tablero.
- Combustible utilizado registrado para control operativo.

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

function fakeSave(msg) {
  alert("✅ " + msg);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tabLogin").addEventListener("click", () => switchAuth("login"));
  document.getElementById("tabRegister").addEventListener("click", () => switchAuth("register"));
  document.getElementById("registerPassword").addEventListener("input", updatePasswordRules);
  document.getElementById("registerForm").addEventListener("submit", registerAccount);
  document.getElementById("loginForm").addEventListener("submit", login);
});
