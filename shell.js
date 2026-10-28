const page = document.body.dataset.page || '';
document.querySelectorAll('[data-nav]').forEach(a=>{ if(a.dataset.nav===page) a.classList.add('active'); });

const slides = [
  {tag:'ENTORNO VIRTUAL DE APRENDIZAJE', title:'Aprende · Conecta · Construye', body:'Experiencias de aprendizaje mediadas por tecnología con propósito pedagógico.', cta:'Explorar mis cursos'},
  {tag:'ACC360', title:'Tecnología invisible, aprendizaje visible', body:'Rutas claras, recursos interactivos y acompañamiento para que la tecnología apoye el aprendizaje.', cta:'Ir a mi área personal'},
  {tag:'APRENDIZAJE ACTIVO', title:'Tu ruta de aprendizaje comienza aquí', body:'Accede a tus cursos, continúa donde quedaste y revisa las próximas actividades.', cta:'Ver mis cursos'}
];
let s=0;
function paintSlide(i){
  const t=document.querySelector('#bannerTag'),h=document.querySelector('#bannerTitle'),b=document.querySelector('#bannerBody'),c=document.querySelector('#bannerCta');
  if(!t)return; const x=slides[i]; t.textContent=x.tag;h.textContent=x.title;b.textContent=x.body;c.textContent=x.cta;
  c.href=i===1?'area-personal.html':'mis-cursos.html';
  document.querySelectorAll('.banner-dots button').forEach((d,k)=>d.classList.toggle('active',k===i));
}
document.querySelectorAll('.banner-dots button').forEach((d,i)=>d.addEventListener('click',()=>{s=i;paintSlide(s)}));
if(document.querySelector('#bannerTitle')){paintSlide(0);setInterval(()=>{s=(s+1)%slides.length;paintSlide(s)},6500)}

const search=document.querySelector('#courseSearch');
const filter=document.querySelector('#courseFilter');
function filterCourses(){
  if(!search)return; const q=search.value.toLowerCase(); const f=filter.value;
  document.querySelectorAll('.course-card').forEach(card=>{
    const match=card.textContent.toLowerCase().includes(q) && (f==='all'||card.dataset.state===f);
    card.style.display=match?'flex':'none';
  });
}
search?.addEventListener('input',filterCourses);filter?.addEventListener('change',filterCourses);

function qs(name){return new URLSearchParams(location.search).get(name)}
if(page==='placeholder'){
  const data={
    herramientas:{title:'Herramientas tecnológicas para la educación',subtitle:'Recursos y estrategias TIC',desc:'Curso demostrativo dentro del ecosistema ACC360. En esta V2.0 se muestra únicamente su acceso y estructura base.'},
    metodologias:{title:'Metodologías activas con TIC',subtitle:'Aprendizaje activo mediado por tecnología',desc:'Curso demostrativo para validar la escalabilidad del catálogo de cursos dentro del prototipo.'}
  };
  const d=data[qs('c')]||data.herramientas;
  document.querySelector('#genericTitle').textContent=d.title;
  document.querySelector('#genericSubtitle').textContent=d.subtitle;
  document.querySelector('#genericDesc').textContent=d.desc;
}
