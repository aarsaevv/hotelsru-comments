import './scss/app.scss'
import { addElementToPage, getTime, customDateWithCurrentTime, serialize, deserialize, removeFromHTML } from './helpers'


// INTRO

/** Я решил использовать localStorage как псевдо-сервер. Вместо того,
 * чтобы лишь кэшировать отправленные сообщения и сохранять их после обновления страницы, я эмулирую запрос к серверу
 * каждый раз при загрузке страницы, следовательно, при изменении входных данных изменяется и отображение. Соответственно,
 * при отправке комментария он сначала изменяет данные на псевдо-сервере, а затем отображение.
 * Единственное послабление (пока что): лайки в localStorage не меняются ввиду того, что не придумал логику подсчета комментариев без авторизации.
 */


// DATA AND ACTIONS WITH DATA

/** Вот и псевдо-данные из БД.
 * Если массив будет пустым или null, будет 0 сообщений.
*/
let commentsArray = [
    {
        id: 1677853903000,
        name: 'cветлана',
        text: 'Я, конечно, понимаю, что вам надо деньги зарабатывать, но нельзя же писать про шампуни!',
        stamp: 1677853903000,
        likedBy: ['Skyler White', 'Saul Goodman', 'Jessie'],
    },
    {
        id: 1678190743000,
        name: 'Игорь',
        text: 'А что такого? Нормальный шампунь. Моя собака не жаловалась.',
        stamp: 1678190743000, 
        likedBy: ['Mike Ermantraut', 'Heisenberg', 'Tuco', 'Gus Fring'],
    },
    {
        id: 1678255543000,
        name: 'cветлана',
        text: 'Не знаю, юмор это или нет, мне всё равно! Так впаривать эту дрянь - возмутительно!',
        stamp: 1678255543000,
        likedBy: ['Skyler White', 'Hector'],
    },
    {
        id: 1678377943000,
        name: 'raygan228',
        text: 'Кто-то тратит деньги на рекламу, а кого-то клиенты находят сами.',
        stamp: 1678377943000,
        likedBy: ['Hank Schrader'],
    },
]

/** Добавляем комментарии в localStorage из массива комментариев. */
function setCommentsToLocalStorage(commentsArray) {

    /** Если с массивом все в порядке, добавляем в localStorage */
    if(commentsArray && commentsArray.length) {

        let comments = serialize(commentsArray)
        localStorage.setItem('comments', comments)
    }

    /** localStorage очищается для "похожести" на 404 */
    else localStorage.clear()
}

/** Забираем комментарии на страницу */
function getCommentsFromLocalStorage() {

    /** Если получили, вызываем функцию для добавления элементов на страницу */
    if(localStorage.getItem('comments')) {

        let parsedComments = deserialize(localStorage.getItem('comments'))
        appendCommentsFromLocalStorage(parsedComments)
    }
}

/** Функция добавления элемента в массив для дальнейшего помещения его в localStorage. */
function addCommentToLocalStorage(parsedComments, formName, formText, formDate) {
    let choosedDateWithCurrentTime = customDateWithCurrentTime(formDate)

    parsedComments.push({
        id: formDate.value ? choosedDateWithCurrentTime : Date.now(),
        name: formName.value,
        text: formText.value,
        stamp: formDate.value ? choosedDateWithCurrentTime : Date.now(),
        likedBy: [],
    })
}

/** Функция удаления элемента списка из localStorage */
function removeCommentFromLocalStorage(id) {
    let parsedComments = deserialize(localStorage.getItem('comments'))

    parsedComments = parsedComments.filter(el => el.id !== id)
    localStorage.setItem('comments', serialize(parsedComments))
}


// HANDLERS

/** Этот хенлдер используется сразу для всех интерактивных элементов. */
function superHandler() {

    let commentsList = document.querySelector('.comments__list')

    let form = document.querySelector('.form')

    let formName = document.querySelector('.form__name')
    let formText = document.querySelector('.form__text')
    let formDate = document.querySelector('.form__date')

    let submitButton = document.querySelector('.form__submit')

    /** Слушатель на поля имени, текстового контента и даты */
    form.addEventListener('keydown', (e) => {

        if(e.target.classList.contains('form__name')
        || e.target.classList.contains('form__text')
        || e.target.classList.contains('form__date')) {

            form.addEventListener('change', (e) => hideValidationMessage())
            form.addEventListener('input', (e) => hideValidationMessage())

            if(e.key === 'Enter') {

                e.preventDefault()
                /** Проверка на правильность заполнения полей, запускающаяся по кнопке Enter. */
                if(formName.value.length > 0 && formName.value.length < 3) {
                    showValidationMessage('Имя должно содержать не менее 3 символов.', formName)
                    return
                }
                else if(formText.value.length > 0 && formText.value.length < 10) {
                    showValidationMessage('Комментарий должен содержать не менее 10 символов.', formText)
                    return
                }
                else if(formName.value.length == 0) {
                    showValidationMessage('Имя не может быть пустым.', formName)
                    return
                }
                else if(formText.value.length == 0) {
                    showValidationMessage('Комментарий не может быть пустым.', formText)
                }
                else {
                    submitComment(formName, formText, formDate)
                    /** Очистка полей после отправки */
                    formName.value = ''
                    formText.value = ''
                    formDate.value = ''
                }
            }
        }
    })

    /** Слушатель на кнопку отправления */
    submitButton.addEventListener('click', (e) => {

        form.addEventListener('change', (e) => hideValidationMessage())
        form.addEventListener('input', (e) => hideValidationMessage())
        
        e.preventDefault()
        /** Проверка на правильность заполнения полей, запускающаяся по кнопке Отправить. */
        if(formName.value.length > 0 && formName.value.length < 3) {
                    showValidationMessage('Имя должно содержать не менее 3 символов.', formName)
                    return
                }
                else if(formText.value.length > 0 && formText.value.length < 10) {
                    showValidationMessage('Комментарий должен содержать не менее 10 символов.', formText)
                    return
                }
                else if(formName.value.length == 0) {
                    showValidationMessage('Имя не может быть пустым.', formName)
                    return
                }
                else if(formText.value.length == 0) {
                    showValidationMessage('Комментарий не может быть пустым.', formText)
                }
                else {
                    submitComment(formName, formText, formDate)
                    /** Очистка полей после клика */
                    formName.value = ''
                    formText.value = ''
                    formDate.value = ''
                }
    })

    /** Слушатель на кнопку удаления */
    commentsList.addEventListener('click', function(e) {

        if(e.target.classList.contains('buttons__delete')) {
            
            let currentItem = e.target.closest('.list__item')
            removeFromHTML(currentItem)
            removeCommentFromLocalStorage(currentItem.commentId)
        }
    })

    /** Слушатель на кнопку лайка */
    commentsList.addEventListener('click', function(e) {

        likeComment(e)
    })
}


// APPENDERS TO HTML

/** Отрисовываем комментарии в списке */
function appendCommentsFromLocalStorage(parsedComments) {

    for(let item of parsedComments) {

        let li = document.createElement('li')
        li.commentId = item.stamp
        addElementToPage(li, 'list__item')(ul, li)


        let name = document.createElement('div')
        addElementToPage(name, 'item__name', item.name)(li, name)

        let text = document.createElement('div')
        addElementToPage(text, 'item__text', item.text)(li, text)

        let info = document.createElement('div')
        addElementToPage(info, 'item__info')(li, info)


        let infoDate = document.createElement('div')
        addElementToPage(infoDate, 'info__date', `${getTime(item.stamp)}`)(info, infoDate)

        let infoButtons = document.createElement('div')
        addElementToPage(infoButtons, 'info__buttons')(info, infoButtons)


        let buttonLike = document.createElement('button')
        addElementToPage(buttonLike, 'buttons__like')(infoButtons, buttonLike)

        let likesCount = document.createElement('span')
        addElementToPage(likesCount, 'info__likes', item.likedBy.length)(infoButtons, likesCount)
        
        let buttonDelete = document.createElement('button')
        addElementToPage(buttonDelete, 'buttons__delete')(infoButtons, buttonDelete)
    }
}

/** Функция добавления элемента в разметку. Вызывает функцию добавления элемента в localStorage. */
function submitComment(formName, formText, formDate) {
    
    /** Помещает наш сабмит прямо в localStorage. Действует по-разному в зависимости от того, есть запись в localStorage на данный момент или нет. */
    if(localStorage.getItem('comments')) {

        let parsedComments = deserialize(localStorage.getItem('comments'))
        addCommentToLocalStorage(parsedComments, formName, formText, formDate)
        localStorage.setItem('comments', serialize(parsedComments))

    } else {
        localStorage.setItem('comments', `[]`)

        let parsedComments = deserialize(localStorage.getItem('comments'))
        addCommentToLocalStorage(parsedComments, formName, formText, formDate)
        localStorage.setItem('comments', serialize(parsedComments))
    }

    let li = document.createElement('li')
    let parsedComments = deserialize(localStorage.getItem('comments'))
    li.commentId = parsedComments[parsedComments.length - 1].id
    addElementToPage(li, 'list__item')(ul, li)

    
    let name = document.createElement('div')
    addElementToPage(name, 'item__name', formName.value)(li, name)

    let text = document.createElement('div')
    addElementToPage(text, 'item__text', formText.value)(li, text)

    let info = document.createElement('div')
    addElementToPage(info, 'item__info')(li, info)


    /** Если дата выбрана, возвращает ее в формате: выбранная дата + текущее время.
     * В противном случае возвращает текущие дату и время.
     */
    let infoDate = document.createElement('div')
    addElementToPage(infoDate, 'info__date', formDate.valueAsNumber 
        ? getTime(customDateWithCurrentTime(formDate)) 
        : getTime(Date.now()))(info, infoDate)

    let infoButtons = document.createElement('div')
    addElementToPage(infoButtons, 'info__buttons')(info, infoButtons)


    let buttonLike = document.createElement('button')
    addElementToPage(buttonLike, 'buttons__like')(infoButtons, buttonLike)

    let likesCount = document.createElement('span')
    addElementToPage(likesCount, 'info__likes', 0)(infoButtons, likesCount)
    
    let buttonDelete = document.createElement('button')
    addElementToPage(buttonDelete, 'buttons__delete')(infoButtons, buttonDelete)
}

function likeComment(e) {
    if(e.target.classList.contains('buttons__like')) {
            
        e.target.classList.toggle('like__active')
        if(e.target.classList.contains('like__active')) {
            e.target.nextSibling.textContent = Number(e.target.nextSibling.textContent) + 1
        }
        else {
            e.target.nextSibling.textContent = Number(e.target.nextSibling.textContent) - 1
        }
    }
}


// NOTIFICATIONS

/** Сообщение о непрошедшей валидации */
function showValidationMessage(str, form) {

    /** Оригинальным способом получаем невалидированный инпут */
    let unvalidatedForm = document.querySelector('.' + form.classList[0])
    let validationMessage = document.createElement('div')

    validationMessage.classList.add('validation-message')
    validationMessage.textContent = str
    /** Предотвращает появление более чем одного уведомления за раз */
    if(document.querySelectorAll('.validation-message').length != 0) {
        document.querySelector('.validation-message').remove()
    }
    else {
        /** Подобная конструкция используется, потому что аппенд на инпут "запирает" его внутри инпута */
        unvalidatedForm.parentNode.insertBefore(validationMessage, unvalidatedForm.nextSibling)
    }
}

/** Скрытие сообщения о непрошедшей валидации */
function hideValidationMessage() {
    if(document.querySelector('.validation-message')) {
        document.querySelector('.validation-message').remove()
    }
}


// STARTUP

let ul = document.querySelector('.comments__list')

// /** Меняем массив через localStorage в целях реализации взаимодействия данных и localStorage */
// if(localStorage.getItem('comments')) {

//     let parsedComments = deserialize(localStorage.getItem('comments'))
//     commentsArray = parsedComments
// }
// else {
//     commentsArray = []
// }

superHandler()
setCommentsToLocalStorage(commentsArray)
getCommentsFromLocalStorage()