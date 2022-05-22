
document.addEventListener("DOMContentLoaded", () => { 

	let level = 0;
	let correct = 0;
	let selected = false;
	
	var answers = JSON.parse(document.getElementById('answers').innerText.trim());
	
	var question = JSON.parse(document.getElementById('questions').innerText.trim());
	
	let alea = 0;
	
	let buttonTemplate = $("<div></div>").addClass("btn btn-light w-50 rounded-0 m-1 border p-2");

	let finalMessage = $(".final-message");
	let progressq = $("#question");
	let options = $(".options");
	let progress = $("#current");
	let screenshot = $(".snippet");
	let proceedButton = $("#proceed");
	let quizbox = $(".quizbox");;
	let guessed = $("#guessed");
	
	addButtons(false,true);
	//~ setScreenshot(true);
	
	gtag('event', 'Show', {
		'event_category': 'QUIZZ',
		'event_label': 'Quiz Started',
	});
	
	//permet dafficher limage des questions a chaque fois
    function setScreenshot(initial)
	{
		if (initial) {
			screenshot.attr("src","ok.png");
		}
		else
		{
			screenshot.fadeOut(300,function(){
				$(this).attr("src","ok.png");
				$(this).fadeIn(300);
			});
		}
	}

	//creer les boutons
	function addButtons(clear,initial)
	{	
		let indice = 0;

		if(level > 0) indice = alea;
		
		if (clear) {
			$(options).empty();
		}

		for (let [i,b] of answers[indice]['entries'].entries()) {
			let tempButton = buttonTemplate.clone();
			tempButton.attr("value",i);
			tempButton.html(b);
			tempButton.click(optionSelect);
			tempButton.appendTo(options);
		}
        if (initial) {
			
			proceedButton.css("display","none");
			proceedButton.click(proceed);
		}

	}

	//verifie si la reponse est vraie ou fausse 
	function markOption(index,correct)
	{
		options.children().eq(index).addClass(correct?"correct":"wrong");
	}

	function optionSelect()
	{	
		let indice = 0;
		
		if (selected || level == 16) {
			return;
		}

		selected = true;

		let indexSelected = parseInt($(this).attr("value"));
		
		if(level > 0) indice = alea;
		
		if (indexSelected == answers[indice]['correct'])
		{
			markOption(indexSelected,true);
			correct++;
		}
		else {
			markOption(indexSelected,false);
			markOption(answers[indice]['correct'],true);
		}

		showButton();
	}

	function showButton()
	{
		proceedButton.show();
	}

	function hideButton()
	{
		proceedButton.hide();
	}

	//fait tourner les question apres chaque reponses
	function proceed()
	{
		if (!selected) {
			return;
		}

		selected = false;
		level++;
		
		alea = Math.floor(Math.random() * question.length);
    
   		while(alea === 0) alea = Math.floor(Math.random() * question.length);
		
		if (level==16) {
			finish();
			return;
		}

		addButtons(true);
		updateProgress();
		hideButton();
		
	}


	function updateProgress()
	{	
		progressq.html(question[alea]);
		progress.html(level);
	}

	function finish()
	{
		gtag('event', 'Show', {
			'event_category': 'QUIZZ',
			'event_label': 'Quiz Finished',
		});

		quizbox.fadeOut(600,function() {
			this.remove();
			guessed.html(correct-1);
			finalMessage.fadeIn(600);
		});
	}


	// Google analystics events.
	function trackEvent() {
		var arr = ['_trackEvent'];
		arr.push.apply(arr, arguments);

		_gaq && _gaq.push(arr);
	}

});

