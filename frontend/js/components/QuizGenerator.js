class QuizGeneratorComponent {
    constructor(apiClient){
        this.apiClient=apiClient; this.form=document.getElementById('quiz-generate-form'); this.title=document.getElementById('quiz-doc-title');
        this.text=document.getElementById('quiz-doc-text'); this.out=document.getElementById('generated-quiz-container'); this.currentQuiz=null; this.answers={};
        this.form?.addEventListener('submit',e=>{e.preventDefault();this.generate()});
        document.getElementById('quiz-presets')?.addEventListener('click',e=>{const b=e.target.closest('[data-preset]');const p={mospi:['National Accounts Statistics','MoSPI compiles India’s National Accounts Statistics. GVA is output minus intermediate consumption and supports evidence-based policymaking.'],gfr:['GFR 2017 Procurement','GFR 2017 emphasizes efficiency, economy, transparency and fair competition in public procurement.'],dataProtection:['DPDP Act 2023','The DPDP Act 2023 establishes a framework for processing digital personal data in India.']}[b?.dataset.preset];if(p){this.title.value=p[0];this.text.value=p[1]}})
    }
    async generate(){
        if(this.text.value.trim().length<20)return;
        try{this.currentQuiz=await this.apiClient.generateQuiz({title:this.title.value.trim(),documentText:this.text.value.trim()});this.answers={};this.render(this.currentQuiz)}
        catch(e){this.out.hidden=false;this.out.innerHTML=`<div class="gov-card empty-state">${this.#esc(e.message)}</div>`}
    }
    render(q){
        const questions=q.questions||[];
        this.out.hidden=false;
        this.out.innerHTML=`<div class="gov-card"><div class="gov-card-header"><div><p class="eyebrow">AI assessment</p><h3>${this.#esc(q.materialTitle||this.title.value)}</h3><p class="form-hint">Select one answer per question, then submit for adaptive scoring.</p></div><span class="badge-tag badge-saffron">Adaptive</span></div>${questions.map((x,i)=>`<article class="quiz-card" data-index="${i}"><p class="question-number">Question ${i+1}</p><p class="question-text">${this.#esc(x.questionText)}</p><div class="options-list">${[['A',x.optionA],['B',x.optionB],['C',x.optionC],['D',x.optionD]].map(o=>`<button type="button" class="option-item" data-q="${i}" data-answer="option${o[0]}"><span class="letter-badge">${o[0]}</span><span>${this.#esc(o[1])}</span></button>`).join('')}</div></article>`).join('')}<div class="quiz-action-row"><button type="button" class="btn btn-primary" id="adaptive-submit">Submit & score adaptively</button></div><div id="adaptive-result" hidden></div></div>`;
        this.out.querySelectorAll('.option-item').forEach(btn=>btn.addEventListener('click',()=>{const qIndex=btn.dataset.q;this.answers[qIndex]=btn.dataset.answer;this.out.querySelectorAll(`.option-item[data-q="${qIndex}"]`).forEach(x=>x.classList.remove('selected'));btn.classList.add('selected')}));
        this.out.querySelector('#adaptive-submit')?.addEventListener('click',()=>this.score());
        window.lucide?.createIcons?.();
    }
    async score(){
        if(!this.currentQuiz)return;
        const mapped={};(this.currentQuiz.questions||[]).forEach((q,i)=>{if(this.answers[i])mapped[q.id]=this.answers[i]});
        const result=this.out.querySelector('#adaptive-result');
        try{
            const score=await this.apiClient.scoreAdaptiveQuiz({quizId:this.currentQuiz.quizId,answers:mapped});
            result.hidden=false;
            result.innerHTML=`<div class="quiz-result" style="margin-top:14px"><div><p class="eyebrow">Adaptive evaluation</p><h3>${this.#esc(score.masteryLevel)} mastery</h3><p>${score.correctAnswers}/${score.totalQuestions} correct • Next difficulty: <strong>${this.#esc(score.nextDifficulty)}</strong></p><p style="margin-top:6px">${this.#esc(score.recommendation)}</p></div><div class="result-score">${score.weightedScore}%</div></div>`;
            window.lucide?.createIcons?.();
        }catch(e){result.hidden=false;result.innerHTML=`<div class="empty-state" style="margin-top:14px">Adaptive scoring unavailable: ${this.#esc(e.message)}</div>`}
    }
    #esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
}
