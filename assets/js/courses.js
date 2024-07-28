var dataObj = {};

$(document).ready(function () {
  const urls = [
    { url: "https://course-ochre.vercel.app/web_courses", type: "web" },
    {
      url: "https://course-ochre.vercel.app/mobile_courses",
      type: "mobile",
    },
  ];

  const responseData = Promise.all(
    urls.map((urlObj) => fetch(urlObj.url))
  ).then((responses) => {
    return Promise.all(
      responses.map((response) => {
        return response.json();
      })
    );
  });

  responseData.then((jsonData) => {
    jsonData.forEach((data, index) => {
      const type = urls[index].type;

      dataObj = { ...dataObj, [type]: data };

      data.forEach((element) => {
        const defaultImage = element["snippet"]["thumbnails"].default.url;
        const srcset = Object.values(element["snippet"]["thumbnails"])
          .map((image) => `${image.url} ${image.width}w`)
          .join(", ");
        const sizes =
          Object.values(element["snippet"]["thumbnails"])
            .map((image) => `(max-width: ${image.width}px) ${image.width}px`)
            .join(", ") + ", 1280px";

        const title = element["snippet"]["title"];
        const description = element["snippet"]["description"];

        const publishedAt = new Date(
          element["snippet"]["publishedAt"]
        ).toLocaleString("id-ID", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        $(`.owl-carousel.${type}`).append(
          `<div data-id="${element.id}" data-type="${type}" class="item">
          <div class="card card-course">
            <img src="${defaultImage}" srcset="${srcset}" sizes="${sizes}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${description}</p>
              <p class="card-text published-at">
                <small class="text-body-secondary">Di publikasi pada ${publishedAt}</small>
              </p>
            </div>
          </div>
        </div>`
        );
      });
    });

    Object.keys(dataObj).forEach((key) => {
      $(`.owl-carousel.${key} .item`).click(function () {
        var index = $(this).context.dataset.id;
        var dataType = $(this).context.dataset.type;

        $("#iframe-modal-youtube").modal({
          fadeDuration: 100,
          escapeClose: false,
          clickClose: false,
          showClose: false,
        });

        $("#iframe-youtube").html(
          dataObj[dataType].find((element) => element.id === index).player
            .embedHtml
        );
      });
    });

    $(".owl-carousel").owlCarousel({
      dots: false,
      items: 3,
      loop: true,
      autoplay: true,
      autoplayHoverPause: true,
    });
  });
});
