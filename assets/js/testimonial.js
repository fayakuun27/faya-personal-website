const testimonials = [
  {
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
    content: "Mantap sekali jasanya!",
    author: "Jimih Setiawan",
    rating: 1,
  },
  {
    image:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
    content: "Keren kamu bro!",
    author: "Adika Wahyu Sulaiman",
    rating: 2,
  },
  {
    image:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
    content: "Keren mantap!",
    author: "Adika Wahyu Lagi",
    rating: 2,
  },
  {
    image:
      "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600",
    content: "Apasih bang!",
    author: "Almas Fadhillah",
    rating: 3,
  },
];

function allTestimonial() {
  if (!testimonials.length) {
    return (document.getElementById(
      "testimonials"
    ).innerHTML = `<h1>Data not found!</h1>`);
  }

  const testimonialHTML = testimonials.map((testimonial) => {
    return `<div class="col">
      <div class="card">
        <img src="${testimonial.image}" class="card-img-top object-fit-cover" alt="..." />
        <div class="card-body">
          <p class="card-text fst-italic">
            "${testimonial.content}"
          </p>
          <p class="text-end fw-bold">-${testimonial.author} Company</p>
          <p class="text-end fw-bold">
            ${testimonial.rating} <i class="fa-solid fa-star"></i>
          </p>
        </div>
      </div>
    </div>`;
  });

  document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
}

function filterTestimonial(rating) {
  // 2
  const filteredTestimonial = testimonials.filter(
    (testimonial) => testimonial.rating == rating
  );

  if (!filteredTestimonial.length) {
    return (document.getElementById(
      "testimonials"
    ).innerHTML = `<h1>Data not found!</h1>`);
  }

  const testimonialHTML = filteredTestimonial.map((testimonial) => {
    return `<div class="col">
    <div class="card">
      <img src="${testimonial.image}" class="card-img-top object-fit-cover" alt="..." />
      <div class="card-body">
        <p class="card-text fst-italic">
          "${testimonial.content}"
        </p>
        <p class="text-end fw-bold">-${testimonial.author} Company</p>
        <p class="text-end fw-bold">
          ${testimonial.rating} <i class="fa-solid fa-star"></i>
        </p>
      </div>
    </div>
  </div>`;
  });

  document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
}

allTestimonial();
