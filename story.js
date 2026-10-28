/* ИИ: маршруты редакции 5 по текстам Figma. Запись №7 в README.
 * Для сцен без отдельного макета используются дословные описания user flow,
 * а не выдуманные диалоги. Их редакционная вёрстка ещё требует сверки. */
"use strict";
const storyScene=(chapter,text,next,art="classroom-after.png",character="bunny-no-hat.png",speaker="банни")=>({chapter,kind:"dialogue",text,next,art,character,speaker});
const storyChoice=(chapter,text,options,art="classroom-after.png",character="bunny-no-hat.png")=>({...storyScene(chapter,text,null,art,character),kind:"choice",prompt:"что ты скажешь?",options:options.map(([label,next])=>({label,next}))});
const storyRoutes={
 afterChat:storyScene("день 1 · это уже было","Это не первый случай: одноклассники цепляются к его одежде, словам и реакции.","bench","corridor.png","bunny-default.png","история"),
 bench:storyScene("день 2 · место занято","В школе ему отказывают в месте на лавке, хотя для своих оно находится.","hat","corridor.png","bunny-default.png","история"),
 hat:storyScene("день 2 · в классе","Банни убирает любимую шапку в рюкзак, но нападки не прекращаются: дело не в том, как он выглядит.","choice","classroom.png","bunny-no-hat.png","история"),
 anger:storyScene("день 2 · злость","Банни пишет злой ответ — но не отправляет.","info","corridor.png","bunny-humiliated.png","история"),
 closeness:{...storyScene("день 2 · в классе","Можно его позвать? Его тоже всё время не замечают.","info","classroom.png"),reply:"Давай пока здесь посидим.",other:"other-teen.png"},
 withdrawal:storyScene("день 2 · у окна","Ты уходишь, банни остаётся один у окна.","info","corridor.png","bunny-default.png","история"),
 info:{chapter:"день 2 · передышка",kind:"info",title:"Когда это не просто ссора",text:"«Мы же просто шутим»: когда это уже травля",art:"foyer-dark.png",image:"info-image.png",points:["Повторяется снова и снова, а не один раз","Один против нескольких — силы неравны","Обидно одному, смешно остальным","Просьбы прекратить не слышат или высмеивают"],next:"branch"},
 A:storyChoice("день 2 · закипает","Я подойду к ним. Пусть хоть раз сами ответят.",[["Подойди. Пусть теперь выкручиваются.","A1"],["Я с тобой. Но мстить не пойду.","A2"]],"bunny-runs.png",null),
 B:storyChoice("день 2 · вместе","Банни боится оставить подростка, который ждёт брата.",[["Отвяжись. Без тебя его не съедят.","B1"],["Пусть с нами идёт. Подождём брата у входа.","B2"]],"classroom.png"),
 C:storyChoice("день 2 · возвращение","Ты возвращаешься, но банни не хочет вопросов.",[["Ну ладно. Увидимся.","C1"],["Сесть рядом и не расспрашивать.","C2"]],"corridor.png","bunny-default.png"),
 A1:storyScene("день 2 · что было дальше","Банни идёт к толпе один и возвращается под новые смешки и камеры.","pauseA","corridor.png","bunny-humiliated.png","история"),
 A2:storyScene("день 2 · что было дальше","Ты рядом, банни стирает черновик, но всё ещё злится.","pauseA","corridor.png","bunny-humiliated.png","история"),
 B1:storyScene("день 2 · что было дальше","Ты уходишь, банни остаётся без сил, пока не придёт брат.","pauseB","classroom.png","bunny-no-hat.png","история"),
 B2:storyScene("день 2 · что было дальше","Вы ждёте брата втроём и расходитесь.","pauseB","classroom.png","bunny-no-hat.png","история"),
 C1:storyScene("день 2 · что было дальше","Ты уходишь, банни сидит один до звонка.","pauseC","corridor.png","bunny-default.png","история"),
 C2:storyScene("день 2 · что было дальше","Банни освобождает место рядом и просит переслать домашку.","pauseC","corridor.png","bunny-default.png","история"),
 pauseA:{chapter:"передышка",kind:"info",title:"Когда хочется ответить",text:"Ответ сгоряча часто только разгоняет чат. Сохрани скрины и напиши тому, кто поддержит.",art:"foyer-dark.png",next:"hard"},
 pauseB:{chapter:"передышка",kind:"info",title:"Нельзя всё время быть рядом",text:"Поддерживать не значит спасать в одиночку. Обратись к взрослому и береги себя.",art:"foyer-dark.png",next:"hard"},
 pauseC:{chapter:"передышка",kind:"info",title:"Если разговор не получился",text:"Неудачный разговор — не конец. Можно вернуться к нему позже или найти другого взрослого.",art:"foyer-dark.png",next:"hard"},
 hardA1:storyScene("день 3 · самый тяжёлый момент","После перепалки ты признаёшь, что совет был так себе; толпа вспоминает вчерашнее.","momUnknown",undefined,undefined,"история"),
 hardA2:storyScene("день 3 · самый тяжёлый момент","Мстить не пошли, но нападки не прекращаются.","momUnknown",undefined,undefined,"история"),
 hardB1:storyScene("день 3 · самый тяжёлый момент","Банни устал: и за себя, и за другого.","momUnknown",undefined,undefined,"история"),
 hardB2:storyScene("день 3 · самый тяжёлый момент","Друг больше не один, но банни травят дальше.","momUnknown",undefined,undefined,"история"),
 hardC1:storyScene("день 3 · самый тяжёлый момент","Ты снова вернулся, банни принимает это настороженно.","momUnknown",undefined,undefined,"история"),
 hardC2:storyScene("день 3 · самый тяжёлый момент","Тихое «я рядом» сработало: банни благодарит и решается рассказать про школу.","momUnknown",undefined,undefined,"история"),
 momUnknown:storyScene("день 3 · мама не знает","Мама знает только про один раз. Если она пойдёт в школу, станет только хуже.","tellMom"),
 tellMom:storyChoice("день 3 · рассказать маме?","Я не хочу туда завтра. Совсем.",[["Да. Давай расскажем ей вместе.","messageMom"],["Давай пока не будем рассказывать.","openEnding"]]),
 messageMom:{...storyScene("день 3 · пишем маме","Я сам напишу. Только будь рядом.","momListens"),kind:"momchat"},
 momListens:storyScene("день 3 · разговор с мамой","Мама выслушивает Банни, обсуждает с ним дальнейшие действия и подключает школу к вопросам безопасности.","friendOrAdults","kitchen.png","bunny-default.png","история"),
 friendHelp:storyScene("день 3 · и про друга тоже","В ветке сближения помощь взрослых касается и другого подростка.","adults","kitchen.png","bunny-default.png","история"),
 adults:{...storyScene("день 3 · взрослые рядом","Сохраним переписку. Завтра вместе поговорим со школой.","newSchool","kitchen.png","bunny-default.png","мама"),reply:"Я тоже могу рассказать, что видел.",other:"mom.png"},
 newSchool:storyScene("после дождя","Семья вместе выбирает другую школу; перевод занимает время и не подаётся как универсальное решение.","weeksLater","kitchen.png","bunny-default.png","история"),
 weeksLater:storyScene("несколько недель спустя","Банни постепенно находит место за общим игровым столом.","silent","final.png",null,"история"),
 silent:{chapter:"после дождя",kind:"silent",art:"final.png",next:"resources"},
 openEnding:{chapter:"открытый финал",kind:"ending",art:"prologue-park.png",title:"Сегодня рассказать не получилось",text:"Закончилась эта версия — не история. У Банни, как и у тебя, есть возможность попросить о помощи.",next:"resources"},
 resources:{chapter:"что дальше",kind:"resources",art:"foyer-dark.png",title:"Ты можешь быть рядом",next:"supportPage"},
 supportPage:{chapter:"поддержать",kind:"supportpage",art:"foyer-dark.png",title:"Сделай среду безопаснее"}
};
if(typeof module!=="undefined")module.exports=storyRoutes;
