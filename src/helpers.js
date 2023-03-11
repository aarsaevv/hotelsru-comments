/** Функция-хэлпер для унифицированного добавления элементов в DOM-дерево.
 * Настраивает свойства элемента, затем добавляет его в выбранную ноду.
 * 
 * Параметры элемента:
 * 1. Имя созданного элемента
 * 2. Название класса: String
 * 3. Текстовый контент: String
 * 4. Родительская нода
 * 5. Дочерняя нода
 */
export const addElementToPage = (tagVariable, className, textContent = '') => {

    tagVariable.classList.add(className)
    tagVariable.textContent = textContent

    return function appendElement(parentNode, childNode) {
        parentNode.append(childNode)
    }
}


/** Сериализатор */
export const serialize = (entry) => JSON.stringify(entry)


/** Десериализатор */
export const deserialize = (entry) => JSON.parse(entry)


/** Функция проверки и отображения таймстампа в человеческом формате. Если пост написан сегодня или вчера, отображает это и время.
 * Если пост написан давно, отображает дату и время.
 */
export const getTime = (stamp) => {
    let date = new Date(stamp)
    const ONE_DAY_IN_MS = 86400000
    const TWO_DAYS_IN_MS = 172800000

    return ((Date.now() - stamp) < ONE_DAY_IN_MS)
        ? 'Сегодня, ' + date.toLocaleTimeString(['ru-RU'], {hour: '2-digit', minute: '2-digit'})
        : (((Date.now() - stamp) > ONE_DAY_IN_MS) && ((Date.now() - stamp) < TWO_DAYS_IN_MS))
        ? 'Вчера, ' + date.toLocaleTimeString(['ru-RU'], {hour: '2-digit', minute: '2-digit'})
        : [date.toLocaleTimeString(['ru-RU'], {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})]
}


/** Функция для отображения выбранной кастомной даты в инпуте, но с текущим временем у пользователя. */
export const customDateWithCurrentTime = (formDate) => {
    const ONE_HOUR_IN_MS = 3600000
    const ONE_MINUTE_IN_MS = 60000
    
    let date = new Date()
    
    let hoursInMs = date.getHours() * ONE_HOUR_IN_MS
    let minutesInMs = date.getMinutes() * ONE_MINUTE_IN_MS
    let timeAfterMidnight = hoursInMs + minutesInMs
    
    let choosedDateWithNoTime = formDate.valueAsNumber - (6 * ONE_HOUR_IN_MS)
    let choosedDateWithCurrentTime = choosedDateWithNoTime + timeAfterMidnight

    return choosedDateWithCurrentTime
}