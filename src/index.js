import './scss/app.scss'

/** Я решил использовать localStorage (далее LS) как псевдо-сервер. Вместо того,
 * чтобы лишь кэшировать отправленные сообщения и сохранять их после обновления страницы, я эмулирую запрос к серверу
 * каждый раз при загрузке страницы, следовательно, при изменении входных данных изменяется и отображение. Соответственно,
 * при отправке комментария он сначала изменяет данные на псевдо-сервере, а затем отображение.
 */

/** Вот и псевдо-данные из БД.
 * Если массив будет пустым или null, будет 0 сообщений
*/
let commentsArray = [
    {
        id: 0,
        name: 'cветлана',
        text: 'Я, конечно, понимаю, что вам надо деньги зарабатывать, но нельзя же писать про шампуни!',
        date: '07-03-2023',
        time: '23:48',
        likes: 14,
    },
    {
        id: 1,
        name: 'Игорь',
        text: 'А что такого? Нормальный шампунь. Моя собака не жаловалась.',
        date: '07-03-2023',
        time: '23:59',
        likes: 14,
    },
    {
        id: 2,
        name: 'cветлана',
        text: 'Не знаю, юмор это или нет, мне всё равно! Так впаривать эту дрянь - возмутительно!',
        date: '08-03-2023',
        time: '00:18',
        likes: 14,
    },
    {
        id: 3,
        name: 'raygan228',
        text: 'Кто-то тратит деньги на рекламу, а кого-то клиенты находят сами.',
        date: '07-03-2023',
        time: '09:35',
        likes: 14,
    },
]

// commentsArray = null

/** Добавляем комментарии */
function setCommentsToLocalStorage(commentsArray) {
    /** Если с массивом все в порядке, добавляем в LS */
    if(commentsArray && commentsArray.length) {
        let comments = JSON.stringify(commentsArray)
        localStorage.setItem('comments', comments)
    }
    /** LS очищается для "похожести" на 404 */
    else localStorage.clear()
}

/** Забираем комментарии */
function getCommentsFromLocalStorage() {
    hideLoadingMessage()
    /** Если получили, вызываем функции для добавления элементов на страницу */
    if(localStorage.getItem('comments')) {
        let parsedComments = JSON.parse(localStorage.getItem('comments'))
        appendCommentsCount(parsedComments)
        appendComments(parsedComments)

    /** В противном случае генерируем сообщение "Нет комментариев..." */
    } else {
        showNoCommentsMessage()
    }
}

/** Функция, которая прибавляет количество комментариев к строке "Комментарии" */
function appendCommentsCount(parsedComments) {
    let header = document.querySelector('.list__header')
    header.textContent = 'Комментарии' + ' [' + parsedComments.length + ']'
}

/** Отрисовываем комментарии со всей информацией в списке */
function appendComments(parsedComments) {
    let ul = document.querySelector('.comments__list')

    for(let item of parsedComments) {
        
        let li = document.createElement('li')
        addElementToPage(li, 'list__item')(ul, li)


        let name = document.createElement('div')
        addElementToPage(name, 'item__name', item.name)(li, name)

        let text = document.createElement('div')
        addElementToPage(text, 'item__text', item.text)(li, text)

        let info = document.createElement('div')
        addElementToPage(info, 'item__info')(li, info)


        let infoDate = document.createElement('div')
        addElementToPage(infoDate, 'info__date', `${item.date}, ${item.time}`)(info, infoDate)

        let infoButtons = document.createElement('div')
        addElementToPage(infoButtons, 'info__buttons')(info, infoButtons)


        let buttonLike = document.createElement('button')
        addElementToPage(buttonLike, 'buttons__like', 'Лайкнуть')(infoButtons, buttonLike)
        
        let buttonDelete = document.createElement('button')
        addElementToPage(buttonDelete, 'buttons__delete', 'Удалить')(infoButtons, buttonDelete)
    }
}

/** Сообщение, если комментариев нет */
function showNoCommentsMessage() {
    let ul = document.querySelector('.comments__list')
    let errorMessage = document.createElement('h1')
    errorMessage.classList.add('comments__error')
    errorMessage.textContent = 'Нет комментариев. Будьте первым, кто оставит комментарий.'
    ul.append(errorMessage)
}

/** Заглушка загрузки */
function showLoadingMessage() {
    let ul = document.querySelector('.comments__list')
    let loadingMessage = document.createElement('h1')
    loadingMessage.classList.add('comments__loading')
    loadingMessage.textContent = 'Загрузка комментариев...'
    ul.append(loadingMessage)
}

/** Её скрытие */
function hideLoadingMessage() {
    let loadingMessage = document.querySelector('.comments__loading')
    loadingMessage.remove()
}

/** Небольшая задержка для реалистичности */
setTimeout(() => setCommentsToLocalStorage(commentsArray), 100)
setTimeout(() => getCommentsFromLocalStorage(), 800)

/** И заглушка */
showLoadingMessage()

/** Заметки на полях:
 * 1. Написать хэлпер для создания форм
 * 2. Сделать отправку и удаление
 * 3. Сделать отображение лайков и лайк/дизлайк
 * 4. Сделать таймстамп и вчера/сегодня
 */

function addElementToPage(tagVariable, className, textContent = '') {
    tagVariable.classList.add(className)
    tagVariable.textContent = textContent

    return function appendElement(parentNode, childNode) {
        parentNode.append(childNode)
    }
}