const stateKey = 'acc360_moodle_demo_completion_v1';
const allActivities = [...document.querySelectorAll('.activity[data-activity]')];
const total = allActivities.length;
let completed = new Set(JSON.parse(localStorage.getItem(stateKey) || '[]'));

const contentMap = {
  guide: ['GUÍA DEL CURSO','Guía para iniciar','Esta guía orienta la ruta de aprendizaje y explica cómo trabajar antes, durante y después de la clase.', ['Revisa los recursos de Activación antes del encuentro.','Participa en las actividades de Construcción.','Entrega la evidencia y realiza el Quiz en Consolidación.']],
  welcome:['INFORMACIÓN','Bienvenida al curso','Bienvenido/a a ACC360. Este espacio organiza la experiencia académica en Moodle y te guía en tres casos de factorización.',['La tecnología apoya el razonamiento; no lo reemplaza.','Moodle conserva las evidencias, calificaciones y progreso oficial.']],
  objectives:['INFORMACIÓN','Objetivos de aprendizaje','Al finalizar la ruta podrás reconocer, seleccionar y aplicar estrategias de factorización, justificando y comprobando tus procedimientos.',['Factor común','Diferencia de cuadrados','Trinomio cuadrado perfecto']],
  methodology:['METODOLOGÍA','ACC + PACIE + Flipped Classroom','ACC organiza la experiencia en Activación, Construcción y Consolidación. PACIE articula Exposición, Rebote, Construcción y Comprobación.',['Activación: Exposición + Rebote','Construcción: aplicación, colaboración y clase','Consolidación: Comprobación, transferencia y metacognición']],
  rubric:['EVALUACIÓN','Rúbricas y criterios','Las evidencias del tema se valoran con criterios explícitos de procedimiento, argumentación y comprobación.',['Exactitud matemática','Justificación del procedimiento','Comprobación de la equivalencia','Claridad de la explicación']],
  announcements:['COMUNICACIÓN','Avisos del docente','Área demostrativa para comunicados académicos.',['Sin avisos nuevos en este prototipo.']],
  calendar:['COMUNICACIÓN','Cronograma','Ejemplo de cronograma por tema. Las fechas reales deben configurarse en Moodle.',['Tema 1: Factor común','Tema 2: Diferencia de cuadrados','Tema 3: Trinomio cuadrado perfecto']],
  session:['COMUNICACIÓN','Clase sincrónica','Acceso demostrativo a la clase encuentro.',['En una implementación real se colocará el enlace institucional autorizado.']],
  news:['COMUNICACIÓN','Novedades','Foro de anuncios del curso.',['Solo el docente publica anuncios oficiales.']],
  forum:['INTERACCIÓN','Foro de consultas','Espacio para dudas académicas sobre procedimientos, actividades y recursos.',['Pregunta con claridad.','Muestra tu procedimiento cuando consultes un ejercicio.','Respeta las ideas de los demás.']],
  social:['INTERACCIÓN','Foro social','Espacio informal de convivencia académica y comunidad.',['No sustituye los canales institucionales de soporte.']],
  glossary:['INTERACCIÓN','Glosario matemático','Glosario colaborativo con conceptos esenciales de factorización.',['factor','factorización','cuadrado perfecto','binomio conjugado','trinomio cuadrado perfecto']],
  netiquette:['INTERACCIÓN','Netiqueta','Acuerdos para una participación respetuosa y académica.',['Respeta turnos e ideas.','Evita publicar datos personales.','Cita recursos externos cuando corresponda.']],
  synthesis:['CIERRE','Síntesis visual','Comparador de decisión entre los tres casos de factorización.',['¿Todos los términos comparten un factor? → Factor común.','¿Hay una resta de dos cuadrados perfectos? → Diferencia de cuadrados.','¿Hay dos extremos cuadrados perfectos y el término medio es el doble producto? → TCP.']],
  integrative:['CIERRE','Reto integrador','Actividad de transferencia para seleccionar la estrategia antes de operar.',['1. Observa la estructura.','2. Decide el caso.','3. Factoriza.','4. Comprueba.']],
  selfeval:['CIERRE','Autoevaluación global','Reflexiona sobre tu nivel de autonomía.',['Puedo reconocer cada caso.','Puedo justificar por qué corresponde.','Puedo comprobar mi resultado.']],
  reflection:['CIERRE','Reflexión final','Explica qué pistas matemáticas utilizas para decidir cómo factorizar una expresión.',['Respuesta abierta de demostración.']]
};

function resourceFallback(id){
  const card=document.querySelector(`[data-activity="${id}"]`);
  if(!card) return ['ACTIVIDAD','Recurso de demostración','Este recurso representa una actividad Moodle todavía no conectada a un LMS real.',['La acción no envía datos ni calificaciones.']];
  return [card.querySelector('.activity-copy small')?.textContent || 'ACTIVIDAD', card.querySelector('h3')?.textContent || 'Actividad', card.querySelector('p')?.textContent || '', ['Tipo Moodle: '+[...card.querySelectorAll('.tags span')].map(x=>x.textContent).join(' · '),'Estado: prototipo visual navegable','Los datos no se envían a un servidor.']];
}

function updateProgress(){
  allActivities.forEach(card=>{const id=card.dataset.activity; const done=completed.has(id); card.classList.toggle('done',done); const b=card.querySelector('.complete'); b.textContent=done?'✓':'○'; b.setAttribute('aria-pressed',done?'true':'false')});
  const count=completed.size; const pct=Math.round(count/total*100);
  document.getElementById('heroProgressText').textContent=pct+'%';
  document.getElementById('heroCompletedText').textContent=`${count} de ${total} actividades`;
  document.getElementById('heroProgressBar').style.width=pct+'%';
  document.getElementById('sideProgressText').textContent=pct+'%';
  document.getElementById('sideProgressBar').style.width=pct+'%';
  const next=allActivities.find(x=>!completed.has(x.dataset.activity));
  document.getElementById('nextStep').textContent=next?next.querySelector('h3').textContent:'Ruta académica completada';
  document.querySelectorAll('.topic-section').forEach(topic=>{
    const cards=[...topic.querySelectorAll('.activity[data-activity]')]; const done=cards.filter(x=>completed.has(x.dataset.activity)).length; const tp=Math.round(done/cards.length*100);
    topic.querySelector('.topicPct').textContent=tp+'%'; topic.querySelector('.topicCount').textContent=`${done}/${cards.length} completadas`; topic.querySelector('.topic-progress .progress span').style.width=tp+'%';
  });
  localStorage.setItem(stateKey,JSON.stringify([...completed]));
}

allActivities.forEach(card=>{
  card.querySelector('.complete').addEventListener('click',()=>{const id=card.dataset.activity; completed.has(id)?completed.delete(id):completed.add(id); updateProgress(); toast(completed.has(id)?'Actividad marcada como realizada':'Actividad marcada como pendiente')});
});

document.querySelectorAll('.topic-header').forEach(btn=>btn.addEventListener('click',()=>{const section=btn.closest('.topic-section'); const open=section.classList.toggle('open'); btn.setAttribute('aria-expanded',String(open)); section.querySelector('.chev').textContent=open?'⌃':'⌄'}));

document.querySelectorAll('.nav-item').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active')); link.classList.add('active'); document.getElementById('sidebar').classList.remove('show')}));

document.getElementById('menuBtn').addEventListener('click',e=>{const sb=document.getElementById('sidebar'); const open=sb.classList.toggle('show'); e.currentTarget.setAttribute('aria-expanded',String(open))});

const modal=document.getElementById('modal');
function openModal(id){const [type,title,desc,items]=contentMap[id]||resourceFallback(id); document.getElementById('modalType').textContent=type; document.getElementById('modalTitle').textContent=title; document.getElementById('modalBody').innerHTML=`<p>${desc}</p><div class="mock-panel"><strong>Contenido de demostración</strong><ul>${(items||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div><p><small>Este prototipo no está conectado a un servidor Moodle ni almacena calificaciones reales.</small></p>`; document.getElementById('demoAction').dataset.id=id; modal.showModal()}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.open)));
document.getElementById('closeModal').addEventListener('click',()=>modal.close()); document.getElementById('closeModal2').addEventListener('click',()=>modal.close());
document.getElementById('demoAction').addEventListener('click',()=>{const id=document.getElementById('demoAction').dataset.id; if(document.querySelector(`[data-activity="${id}"]`)){completed.add(id); updateProgress(); toast('Acción demo completada');}else toast('Acción demostrativa'); modal.close()});

function toast(msg){const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(window._toast); window._toast=setTimeout(()=>t.classList.remove('show'),1800)}
updateProgress();

// Laboratorio de factorización de la portada.
const labData = {
  common: {
    equation: '6x² + 9x = <strong>3x(2x + 3)</strong>',
    note: 'El lado común representa el factor común. Extrae 3x y comprueba multiplicando: 3x(2x + 3).',
    href: '#tema1',
    aria: 'Modelo de área para factor común',
    svg: `
      <svg viewBox="0 0 520 230" role="img" aria-label="Modelo de área para factor común">
        <text x="255" y="24" text-anchor="middle" class="svg-title">Factor común = lado compartido</text>
        <text x="210" y="54" text-anchor="middle" class="svg-label">2x</text>
        <text x="375" y="54" text-anchor="middle" class="svg-label">3</text>
        <text x="77" y="143" text-anchor="middle" class="svg-label">3x</text>
        <rect x="105" y="70" width="210" height="135" rx="4" class="tile tile-a"/>
        <rect x="315" y="70" width="130" height="135" rx="4" class="tile tile-b"/>
        <text x="210" y="147" text-anchor="middle" class="svg-value">6x²</text>
        <text x="380" y="147" text-anchor="middle" class="svg-value">9x</text>
      </svg>`
  },
  squares: {
    equation: 'x² − 9 = <strong>(x − 3)(x + 3)</strong>',
    note: 'Reconoce una resta de dos cuadrados perfectos. Las raíces x y 3 producen dos binomios conjugados.',
    href: '#tema2',
    aria: 'Representación de una diferencia de cuadrados',
    svg: `
      <svg viewBox="0 0 520 230" role="img" aria-label="Representación de una diferencia de cuadrados">
        <text x="260" y="26" text-anchor="middle" class="svg-title">Dos cuadrados perfectos y una resta</text>
        <rect x="70" y="60" width="145" height="145" rx="5" class="tile tile-a"/>
        <text x="142" y="140" text-anchor="middle" class="svg-value">x²</text>
        <text x="260" y="142" text-anchor="middle" class="svg-op">−</text>
        <rect x="305" y="95" width="95" height="95" rx="5" class="tile tile-d"/>
        <text x="352" y="151" text-anchor="middle" class="svg-value">3²</text>
        <path d="M420 125 C465 125, 475 155, 440 180" fill="none" stroke="#6b7f90" stroke-width="3" stroke-linecap="round"/>
        <path d="M438 172 L440 181 L450 178" fill="none" stroke="#6b7f90" stroke-width="3" stroke-linecap="round"/>
        <text x="425" y="211" text-anchor="middle" class="svg-note">(x−3)(x+3)</text>
      </svg>`
  },
  tcp: {
    equation: 'x² + 6x + 9 = <strong>(x + 3)²</strong>',
    note: 'Los extremos son cuadrados perfectos y 6x es el doble producto: 2·x·3. El resultado es un binomio al cuadrado.',
    href: '#tema3',
    aria: 'Modelo de área para trinomio cuadrado perfecto',
    svg: `
      <svg viewBox="0 0 520 230" role="img" aria-label="Modelo de área para trinomio cuadrado perfecto">
        <text x="260" y="24" text-anchor="middle" class="svg-title">El trinomio completa un cuadrado</text>
        <text x="205" y="49" text-anchor="middle" class="svg-label">x</text>
        <text x="382" y="49" text-anchor="middle" class="svg-label">3</text>
        <text x="72" y="131" text-anchor="middle" class="svg-label">x</text>
        <text x="72" y="190" text-anchor="middle" class="svg-label">3</text>
        <rect x="105" y="58" width="210" height="120" rx="3" class="tile tile-a"/>
        <rect x="315" y="58" width="95" height="120" rx="3" class="tile tile-c"/>
        <rect x="105" y="178" width="210" height="42" rx="3" class="tile tile-c"/>
        <rect x="315" y="178" width="95" height="42" rx="3" class="tile tile-d"/>
        <text x="210" y="126" text-anchor="middle" class="svg-value">x²</text>
        <text x="362" y="126" text-anchor="middle" class="svg-value">3x</text>
        <text x="210" y="207" text-anchor="middle" class="svg-value">3x</text>
        <text x="362" y="207" text-anchor="middle" class="svg-value">9</text>
      </svg>`
  }
};

const labTabs = [...document.querySelectorAll('.lab-tab')];
const labEquation = document.getElementById('labEquation');
const labVisual = document.getElementById('labVisual');
const labNote = document.getElementById('labNote');
const labTopicLink = document.getElementById('labTopicLink');
function setLab(key){
  const data = labData[key];
  if(!data || !labEquation) return;
  labTabs.forEach(tab=>{const active=tab.dataset.lab===key; tab.classList.toggle('active',active); tab.setAttribute('aria-selected',String(active));});
  labEquation.innerHTML=data.equation;
  labVisual.innerHTML=data.svg;
  labNote.textContent=data.note;
  labTopicLink.href=data.href;
}
labTabs.forEach(tab=>tab.addEventListener('click',()=>setLab(tab.dataset.lab)));
