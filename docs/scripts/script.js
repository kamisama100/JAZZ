let dataArray = []
const tableBody = document.querySelector("tbody")
const itemsPerPage = 5
const pageNumbersContainer = document.getElementById("page-numbers")
let currentPage = 1

const createPageNumberButton = (pageNumber) => {
  const button = document.createElement("button")
  button.textContent = pageNumber
  button.addEventListener("click", () => {
    currentPage = pageNumber
    getData()
  })
  return button
}

const updatePageNumbers = () => {
  pageNumbersContainer.innerHTML = ""
  const totalItems = dataArray.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  for (let i = 1; i <= totalPages; i++) {
    const button = createPageNumberButton(i)

    if (i === currentPage) {
      button.classList.add("current-page")
    }

    pageNumbersContainer.appendChild(button)
  }
}

const getData = async () => {
  try {
    const response = await fetch("../data.json")
    const data = await response.json()
    dataArray = data.data

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const currentPageData = dataArray.slice(startIndex, endIndex)

    tableBody.innerHTML = ""

    currentPageData.forEach((mainData) => {
      const tableRow = document.createElement("tr")
      tableRow.innerHTML = `
        <td>${mainData.sellerName}</td>
        <td>${mainData.ratingPercentage}%</td>
        <td>${addCommas(mainData.ratingCount)}</td>
        <td>${transformTimeStamp(mainData.lastWonUTC)}</td>
        <td>${convertSecondsToTimeAgo(mainData.winDurationSeconds)}</td>
      `
      tableBody.appendChild(tableRow)
    })

    updateButtons()
    updatePageNumbers()
  } catch (error) {
    console.error(error)
  }
}

const updateButtons = () => {
  const nextButton = document.getElementById("next")
  const prevButton = document.getElementById("prev")

  prevButton.disabled = currentPage === 1

  const totalItems = dataArray.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  nextButton.disabled = currentPage === totalPages
}

document.getElementById("next").addEventListener("click", () => {
  currentPage++
  getData()
})

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    getData()
  }
})

getData()

const addCommas = (count) => {
  if (isNaN(count)) {
    return "Invalid input"
  }

  const parts = count.toString().split(".")

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return parts.join(".")
}

const transformTimeStamp = (timestamp) => {
  const utcDate = new Date(timestamp)

  const year = utcDate.getUTCFullYear()
  const month = utcDate.getUTCMonth() + 1
  const day = utcDate.getUTCDate()
  const hours = utcDate.getUTCHours()
  const minutes = utcDate.getUTCMinutes()

  const formattedUTCDate = `${month}/${day}/${year} ${hours}:${minutes}`

  return formattedUTCDate
}

const convertSecondsToTimeAgo = (seconds) => {
  if (seconds < 60) {
    return seconds + "s ago"
  } else if (seconds < 3600) {
    var minutes = Math.floor(seconds / 60)
    return minutes + "m ago"
  } else if (seconds < 86400) {
    var hours = Math.floor(seconds / 3600)
    return hours + "h ago"
  } else {
    var days = Math.floor(seconds / 86400)
    return days + "d ago"
  }
}
