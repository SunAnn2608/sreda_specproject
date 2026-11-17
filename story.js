/* ИИ: маршруты редакции 5 по текстам Figma. Запись №7 в README.
 * Для сцен без отдельного макета используются дословные описания user flow,
 * а не выдуманные диалоги. Их редакционная вёрстка ещё требует сверки. */
"use strict";
const storyScene=(chapter,text,next,art="classroom-after.png",character="bunny-no-hat.png",speaker="банни")=>({chapter,kind:"dialogue",text,next,art,character,speaker});
const storyChoice=(chapter,text,options,art="classroom-after.png",character="bunny-no-hat.png")=>({...storyScene(chapter,text,null,art,character),kind:"choice",prompt:"что ты скажешь?",options:options.map(([label,next])=>({label,next}))});
const storyCutscene=(chapter,text,next)=>({chapter,kind:"cutscene",text,next});
const storyRoutes={
 hatCut:storyCutscene("перед уроком","Кролики словно становятся больше. Банни прячет любимую шапку в рюкзак.","firstReaction"),
 witnessCut:storyCutscene("в коридоре","Кроли дёргают белого зайчика за серьгу.","info"),
 confront:{...storyScene("в коридоре","Я пойду к ним. Я больше так не могу. Разберусь раз и навсегда. Пусть хоть раз ответят.","branch","corridor.png","bunny-humiliated.png"),interlude:true},
 harassmentCut:storyCutscene("снова в коридоре","Кроли замечают Банни, обступают его и бросают его шапку на пол. Испуганный Банни падает.","momUnknown"),
 walkToMomCut:storyCutscene("по дороге домой","Вы идёте к маме Банни вместе. У двери он просит тебя остаться рядом.","adults"),
 afterChat:storyScene("это уже было","Это не первый случай: одноклассники цепляются к его одежде, словам и реакции.","bench","corridor.png","bunny-default.png","история"),
 bench:storyScene("место занято","В школе ему отказывают в месте на лавке, хотя для своих оно находится.","hat","corridor.png","bunny-default.png","история"),
 hat:storyScene("в классе","Банни убирает любимую шапку в рюкзак, но нападки не прекращаются: дело не в том, как он выглядит.","choice","classroom.png","bunny-no-hat.png","история"),
 anger:storyScene("злость","Банни пишет злой ответ — но не отправляет.","witnessCut","corridor.png","bunny-humiliated.png","история"),
 closeness:{...storyScene("в классе","Ой, смотри. Его же тоже постоянно задирают.","witnessCut","classroom.png"),reply:"Давай пока здесь посидим.",other:"other-teen.png"},
 withdrawal:storyScene("у окна","Ты уходишь, банни остаётся один у окна.","witnessCut","corridor.png","bunny-default.png","история"),
 info:{chapter:"передышка",kind:"info",title:"Когда это не просто ссора",text:"«Мы же просто шутим»: когда это уже травля",art:"foyer-dark.png",image:"info-image.png",points:["Повторяется снова и снова, а не один раз","Один против нескольких — силы неравны","Обидно одному, смешно остальным","Просьбы прекратить не слышат или высмеивают"],next:"confront"},
 A:storyChoice("закипает","Нет, я всё ещё хочу им ответить.",[["Подойди. Пусть теперь выкручиваются.","A1"],["Я с тобой. Но мстить не пойду.","A2"]],"bunny-runs.png",null),
 B:storyChoice("вместе","Банни боится оставить подростка, который ждёт брата.",[["Отвяжись. Без тебя его не съедят.","B1"],["Пусть с нами идёт. Подождём брата у входа.","B2"]],"classroom.png"),
 C:storyChoice("возвращение","Ты возвращаешься, но банни не хочет вопросов.",[["Ну ладно. Увидимся.","C1"],["Сесть рядом и не расспрашивать.","C2"]],"corridor.png","bunny-default.png"),
 A1:storyScene("что было дальше","Банни идёт к толпе один и возвращается под новые смешки и камеры.","pauseA","corridor.png","bunny-humiliated.png","история"),
 A2:storyScene("что было дальше","Ты рядом, банни стирает черновик, но всё ещё злится.","pauseA","corridor.png","bunny-humiliated.png","история"),
 B1:storyScene("что было дальше","Ты уходишь, банни остаётся без сил, пока не придёт брат.","pauseB","classroom.png","bunny-no-hat.png","история"),
 B2:storyScene("что было дальше","Вы ждёте брата втроём и расходитесь.","pauseB","classroom.png","bunny-no-hat.png","история"),
 C1:storyScene("что было дальше","Ты уходишь, банни сидит один до звонка.","pauseC","corridor.png","bunny-default.png","история"),
 C2:storyScene("что было дальше","Банни освобождает место рядом и просит переслать домашку.","pauseC","corridor.png","bunny-default.png","история"),
 pauseA:{chapter:"передышка",kind:"info",title:"Когда хочется ответить",text:"Ответ сгоряча часто только разгоняет чат. Сохрани скрины и напиши тому, кто поддержит.",art:"foyer-dark.png",next:"hard"},
 pauseB:{chapter:"передышка",kind:"info",title:"Нельзя всё время быть рядом",text:"Поддерживать не значит спасать в одиночку. Обратись к взрослому и береги себя.",art:"foyer-dark.png",next:"hard"},
 pauseC:{chapter:"передышка",kind:"info",title:"Если разговор не получился",text:"Неудачный разговор — не конец. Можно вернуться к нему позже или найти другого взрослого.",art:"foyer-dark.png",next:"hard"},
 hardA1:storyScene("самый тяжёлый момент","После перепалки ты признаёшь, что совет был так себе; толпа вспоминает фото из чата.","harassmentCut",undefined,undefined,"история"),
 hardA2:storyScene("самый тяжёлый момент","Мстить не пошли, но нападки не прекращаются.","harassmentCut",undefined,undefined,"история"),
 hardB1:storyScene("самый тяжёлый момент","Банни устал: и за себя, и за другого.","harassmentCut",undefined,undefined,"история"),
 hardB2:storyScene("самый тяжёлый момент","Друг больше не один, но банни травят дальше.","harassmentCut",undefined,undefined,"история"),
 hardC1:storyScene("самый тяжёлый момент","Ты снова вернулся, банни принимает это настороженно.","harassmentCut",undefined,undefined,"история"),
 hardC2:storyScene("самый тяжёлый момент","Тихое «я рядом» сработало: банни благодарит и решается рассказать про школу.","harassmentCut",undefined,undefined,"история"),
 momUnknown:storyScene("мама не знает","Мама знает только про один раз. Если она пойдёт в школу, станет только хуже.","tellMom"),
 tellMom:storyChoice("рассказать маме?","Я не хочу туда завтра. Совсем.",[["Да. Давай расскажем ей вместе.","messageMom"],["Давай пока не будем рассказывать.","openEnding"]]),
 messageMom:{...storyScene("пишем маме","Я сам напишу. Только будь рядом.","momListens"),kind:"momchat",next:"walkToMomCut"},
 momListens:storyScene("разговор с мамой","Мама выслушивает Банни, обсуждает с ним дальнейшие действия и подключает школу к вопросам безопасности.","friendOrAdults","kitchen.png","bunny-default.png","история"),
 friendHelp:storyScene("и про друга тоже","В ветке сближения помощь взрослых касается и другого подростка.","adults","kitchen.png","bunny-default.png","история"),
 adults:{...storyScene("взрослые рядом","Сохраним переписку. Сегодня вместе поговорим со школой.","silent","kitchen.png","bunny-default.png","мама"),reply:"Я тоже могу рассказать, что видел.",other:"mom.png"},
 newSchool:storyScene("после дождя","Семья вместе выбирает другую школу; перевод занимает время и не подаётся как универсальное решение.","weeksLater","kitchen.png","bunny-default.png","история"),
 weeksLater:storyScene("несколько недель спустя","Банни постепенно находит место за общим игровым столом.","silent","final.png",null,"история"),
 silent:{chapter:"после дождя",kind:"silent",art:"final.png",next:"resources"},
 openEnding:{chapter:"открытый финал",kind:"ending",art:"prologue-park.png",title:"Сегодня помочь не получилось",text:"Банни остался один на один с проблемой. Но у него, как и у тебя, есть возможность попросить о помощи.",next:"resources"},
 resources:{chapter:"что дальше",kind:"resources",art:"foyer-dark.png",title:"Ты можешь быть рядом",next:"supportPage"},
 supportPage:{chapter:"поддержать проект",kind:"supportpage",art:"foyer-dark.png",title:"Сделай среду безопаснее"}
};
if(typeof module!=="undefined")module.exports=storyRoutes;
