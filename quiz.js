'use strict';
// The seven questions, plan weights and Typebot destination preserve the original public flow.
const questions=[
 {t:'O que você mais quer agora?',o:[['Tirar uma dúvida pontual ou ajustar algo que eu já sei fazer',{a:3}],['Organizar minha alimentação e sentir como é ter acompanhamento',{p3:2,p6:1}],['Mudar meus hábitos de verdade e conseguir manter com autonomia',{p6:3}],['Trabalhar composição corporal, treino e alimentação a longo prazo',{p12:3}]]},
 {t:'Como foi sua história com dietas e planos anteriores?',o:[['Nunca tive muita dificuldade, só precisava de orientação',{p3:1,a:1}],['Já tentei várias vezes e voltei ao padrão de sempre',{p6:2,p12:1}],['Costumo ter efeito sanfona ou comer por ansiedade',{p6:2,p12:2}],['Nunca fiz acompanhamento com nutricionista',{p3:1,p6:1}]]},
 {t:'Quanto tempo de suporte próximo você imagina que precisa?',o:[['Uma consulta e sigo com autonomia',{a:3}],['Uns 3 meses para sentir como funciona',{p3:2}],['O tempo de passar por todas as fases e ganhar autonomia',{p6:3}],['Bastante tempo, sem pressa',{p12:3}]]},
 {t:'Como você prefere ser acompanhado no dia a dia?',o:[['Prefiro seguir por conta própria e tirar dúvidas quando precisar',{a:2,p3:1}],['Acompanhamento semanal e WhatsApp nos dias difíceis',{p6:2,p3:1}],['Quero presença próxima e reavaliações frequentes',{p12:2,p6:1}]]},
 {t:'Você prefere atendimento presencial ou online?',o:[['Presencial',{m:'presencial'}],['Online',{m:'online'}],['Ainda não sei, quero conversar sobre isso',{m:'ainda não sei'}]]},
 {t:'Quando você quer começar?',o:[['Quero começar o quanto antes',{r:'Quero começar o quanto antes!'}],['Nas próximas semanas',{r:'Nas próximas semanas'}],['Ainda estou só pesquisando',{r:'Ainda estou só pesquisando'}]]},
 {t:'Como você me conheceu?',o:[['Instagram',{c:'Instagram'}],['Indicação de alguém',{c:'Indicação'}],['Google ou outra busca',{c:'Google / busca'}],['Evento ou palestra',{c:'Evento / palestra'}],['Outro',{c:'Outro'}]]}
];
const plans={a:{name:'Consulta Avulsa',duration:'1 consulta e 30 dias de suporte',text:'Um ponto de partida para uma orientação pontual. Na conversa, a gente confirma se esse formato faz sentido para você.'},p3:{name:'Primeiro Passo',duration:'3 meses',text:'Uma porta de entrada para sentir como é ter acompanhamento, com consultas, acompanhamento semanal e suporte no WhatsApp.'},p6:{name:'Mudança Consistente',duration:'6 meses',text:'Tempo para passar pelas fases Entender, Vencer e Viver, ajustando o plano ao longo do caminho e trabalhando a autonomia.'},p12:{name:'Transformação Completa',duration:'12 meses',text:'Mais tempo de suporte próximo para trabalhar alimentação, composição corporal e objetivos de longo prazo.'}};
let quizStep=0,answers=[],contact={nome:'',idade:'',whats:'',email:'',motivo:''};
const quiz=$('.quiz-dialog'),quizContent=$('#quiz-content');
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function focusQuiz(){requestAnimationFrame(()=>{$('#quiz-title',quiz)?.focus({preventScroll:true});quiz.scrollTop=0;});}
function backButton(){const b=node('button','quiz-back','Voltar');b.type='button';b.addEventListener('click',()=>{quizStep--;renderQuiz();});return b;}
function validateContactField(input){
 if(input.name==='whats'){const digits=input.value.replace(/\D/g,'');input.setCustomValidity(digits.length>=10&&digits.length<=15&&digits[0]!=='0'?'':'Informe um telefone válido com DDD, com 10 a 15 dígitos.');}
 else if(input.name==='email'){input.setCustomValidity(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value.trim())?'':'Informe um email completo, como nome@exemplo.com.');}
 else if(input.name==='nome'||input.name==='motivo'){input.setCustomValidity(input.value.trim().length>=2?'':'Preencha este campo com pelo menos dois caracteres.');}
}
function renderQuiz(){
 quizContent.replaceChildren();$('.quiz-progress>span').style.width=Math.min(100,((quizStep+1)/8)*100)+'%';
 const count=node('p','quiz-count',quizStep<8?'Etapa '+(quizStep+1)+' de 8':'Um começo possível');quizContent.append(count);
 const title=node('h2',null,quizStep<7?questions[quizStep].t:quizStep===7?'Me conta um pouco sobre você.':'O plano sugerido para o seu momento.');title.id='quiz-title';title.tabIndex=-1;quizContent.append(title);
 if(quizStep<7){const options=node('div','quiz-options');questions[quizStep].o.forEach(([label],i)=>{const b=node('button',null,label);b.type='button';b.addEventListener('click',()=>{answers[quizStep]=i;quizStep++;renderQuiz();});options.append(b);});quizContent.append(options);if(quizStep>0)quizContent.append(backButton());quizContent.append(node('p','quiz-privacy','Suas respostas ficam nesta página até você escolher enviar. A sugestão de plano é um ponto de partida para uma conversa.'));}
 else if(quizStep===7){
  const form=node('form','quiz-contact');
  const fields=[['nome','Seu nome','text','name'],['idade','Idade','number','off'],['whats','WhatsApp com DDD','tel','tel'],['email','Seu email','email','email'],['motivo','O que te trouxe até aqui?','textarea','off']];
  fields.forEach(([key,label,type,autocomplete])=>{const wrap=node('label',null,label),input=node(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.name=key;input.required=true;input.autocomplete=autocomplete;input.value=contact[key];if(key==='idade'){input.min='1';input.max='120';}if(key==='whats'){input.inputMode='tel';input.title='Informe um telefone com DDD.';}input.maxLength=key==='motivo'?600:100;validateContactField(input);input.addEventListener('input',()=>{contact[key]=input.value;validateContactField(input);});wrap.append(input);form.append(wrap);});
  const submit=node('button','button','Ver o plano sugerido');submit.type='submit';form.append(submit);form.addEventListener('submit',e=>{e.preventDefault();form.querySelectorAll('input,textarea').forEach(validateContactField);if(form.reportValidity()){quizStep++;renderQuiz();}});quizContent.append(form,backButton(),node('p','quiz-privacy','Os dados ainda não são enviados. Na próxima etapa, você pode conferir as respostas e escolher abrir o canal de triagem do Saulo.'));const policy=node('a','text-link','Consultar privacidade');policy.href='https://saulopessoanutri.com.br/privacidade';policy.target='_blank';policy.rel='noopener';quizContent.append(policy);
 }else renderResult();
 focusQuiz();
}
function renderResult(){
 const score={a:0,p3:0,p6:0,p12:0};let modal='ainda não sei',canal='não informado',prontidao='';
 answers.forEach((ix,qi)=>{for(const [k,v] of Object.entries(questions[qi].o[ix][1])){if(k==='m')modal=v;else if(k==='c')canal=v;else if(k==='r')prontidao=v;else score[k]+=v;}});
 let key='p6';if(answers[0]===0&&answers[2]===0)key='a';else ['p3','p12'].forEach(k=>{if(score[k]>score[key])key=k;});const p=plans[key];
 const result=node('div','quiz-result');result.append(node('span','quiz-result-tag',p.duration),node('h3',null,p.name),node('p',null,p.text),node('p',null,'Na conversa, a gente olha o seu caso com calma e decide junto. A sugestão não substitui uma avaliação individual.'));
 const clean=t=>String(t).replace(/\s+/g,' ').trim();
 const params=new URLSearchParams({Nome:clean(contact.nome),Idade:clean(contact.idade)+' anos',Contato:clean(contact.whats),Email:clean(contact.email),Origem:canal,Objetivo:questions[0].o[answers[0]][0],JaTentou:questions[1].o[answers[1]][0],Dificuldade:clean(contact.motivo),Prontidao:prontidao,Atendimento:modal,Plano:p.name+' ('+p.duration+')'});
 const send=node('a','button','Enviar minhas respostas ao Saulo');send.href='https://typebot.co/triagem-site-saulopessoa?'+params.toString();send.target='_blank';send.rel='noopener';send.addEventListener('click',()=>window.SP_TRACK?.('lead_form_submit',{form_id:'triagem_quiz',plano_sugerido:p.name}));result.append(send,node('p','quiz-privacy','O botão abre a triagem do Saulo no Typebot. Confirme o envio no canal que será aberto. Nenhum dado foi enviado até aqui.'));
 const details=node('details'),summary=node('summary',null,'Conferir minhas respostas'),preview=node('pre',null,[...params.entries()].map(([k,v])=>k+': '+v).join('\n'));details.append(summary,preview);result.append(details);
 const msg='Oi, Saulo! Fiz o questionário no seu site e queria conversar sobre o acompanhamento.\n\n'+'Triagem inicial - '+clean(contact.nome)+'\n'+'Idade: '+clean(contact.idade)+' anos\n'+'Contato: '+clean(contact.whats)+'\n'+'E-mail: '+clean(contact.email)+'\n'+'Como me conheceu: '+canal+'\n'+'Quando quer começar: '+prontidao+'\n'+'Objetivo: '+questions[0].o[answers[0]][0]+'\n'+'Já tentou: '+questions[1].o[answers[1]][0]+'\n'+'Maior dificuldade: '+clean(contact.motivo)+'\n'+'Atendimento: '+modal+'\n'+'Plano sugerido pelo site: '+p.name+' ('+p.duration+')';
 const wa=node('a','text-link js-wa','Prefiro enviar pelo WhatsApp');wa.href='https://wa.me/5561984300666?text='+encodeURIComponent(msg);wa.target='_blank';wa.rel='noopener';result.append(wa);
 const again=node('button','quiz-back','Refazer questionário');again.type='button';again.addEventListener('click',()=>{quizStep=0;answers=[];contact={nome:'',idade:'',whats:'',email:'',motivo:''};renderQuiz();});result.append(document.createElement('br'),again);quizContent.append(result);
}
$$('[data-quiz]').forEach(a=>a.addEventListener('click',e=>{if(typeof quiz.showModal!=='function')return;e.preventDefault();renderQuiz();quiz.showModal();focusQuiz();}));
$$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close();}));
const report=$('.report-dialog');$$('[data-report]').forEach(b=>b.addEventListener('click',e=>{if(typeof report.showModal!=='function')return;e.preventDefault();$('img',report).src=b.dataset.report;$('img',report).alt=(b.dataset.caption||'Página do relatório')+', exemplo com dados fictícios';$('#report-caption').textContent=b.dataset.caption||'Relatório de exemplo';report.showModal();}));
window.addEventListener('load',()=>window.ScrollTrigger?.refresh());document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
// Local previews intentionally do not send analytics or contact data automatically.

function openHashQuiz(){if(location.hash==='#descobrir'&&!quiz.open&&typeof quiz.showModal==='function'){renderQuiz();quiz.showModal();focusQuiz();}}
window.addEventListener('hashchange',openHashQuiz);openHashQuiz();
