// Level-Up Gamer - Enhanced JavaScript Functionality

// Global state
let cart = JSON.parse(localStorage.getItem("levelup-cart")) || []
let currentFilter = "all"

// Product data
const products = {
  JM002: { name: "Carcassonne", price: 24990, category: "juegos-mesa" },
  AC002: { name: "Auriculares HyperX Cloud II", price: 79990, category: "accesorios" },
  CO001: { name: "PlayStation 5", price: 549990, category: "consolas" },
  CG001: { name: "PC Gamer ASUS ROG Strix", price: 1299990, category: "computadores" },
  SG001: { name: "Silla Gamer Secretlab Titan", price: 349990, category: "sillas" },
  MS001: { name: "Mouse Gamer Logitech G502", price: 49990, category: "accesorios" },
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear()

  // Initialize cart
  updateCartDisplay()

  // Setup event listeners
  setupEventListeners()

  // Initialize form validations
  setupFormValidations()

  // Setup product filtering
  setupProductFiltering()

  // Setup star rating
  setupStarRating()
}

function setupEventListeners() {
  // Cart functionality
  document.querySelectorAll(".lu-addcart").forEach((button) => {
    button.addEventListener("click", handleAddToCart)
  })

  // Clear cart button
  const clearCartBtn = document.getElementById("clear-cart")
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart)
  }

  // Filter buttons
  document.querySelectorAll(".lu-filter-btn").forEach((button) => {
    button.addEventListener("click", handleFilterClick)
  })

  // Category cards
  document.querySelectorAll(".lu-cat").forEach((cat) => {
    cat.addEventListener("click", function () {
      const category = this.dataset.category
      if (category) {
        filterProducts(category)
        updateFilterButtons(category)
      }
    })
  })

  // Form submissions
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration)
  }

  const reviewForm = document.getElementById("review-form")
  if (reviewForm) {
    reviewForm.addEventListener("submit", handleReviewSubmission)
  }

  const supportForm = document.getElementById("support-form")
  if (supportForm) {
    supportForm.addEventListener("submit", handleSupportSubmission)
  }
}

// Cart functionality
function handleAddToCart(event) {
  const button = event.target
  const productCard = button.closest(".lu-product")
  const productCode = button.dataset.productCode
  const quantityInput = productCard.querySelector(".lu-qty")
  const quantity = Number.parseInt(quantityInput.value) || 1

  if (!products[productCode]) {
    showNotification("Producto no encontrado", "error")
    return
  }

  // Add to cart
  const existingItem = cart.find((item) => item.code === productCode)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      code: productCode,
      name: products[productCode].name,
      price: products[productCode].price,
      quantity: quantity,
    })
  }

  // Save to localStorage
  localStorage.setItem("levelup-cart", JSON.stringify(cart))

  // Update display
  updateCartDisplay()

  // Visual feedback
  button.textContent = "¡Agregado!"
  button.style.background = "#22c55e"
  setTimeout(() => {
    button.textContent = "Agregar al carrito"
    button.style.background = ""
  }, 1500)

  showNotification(`${products[productCode].name} agregado al carrito`, "success")
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cart-count")
  const cartItems = document.getElementById("cart-items")
  const cartSubtotal = document.getElementById("cart-subtotal")
  const cartTotal = document.getElementById("cart-total")

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  if (cartCount) {
    cartCount.textContent = totalItems
  }

  // Update cart items display
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="cart-empty-message">Tu carrito está vacío</div>'
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <div class="cart-item-header">
            <span class="cart-item-title">${item.name}</span>
            <button class="cart-item-remove" onclick="removeFromCart('${item.code}')">×</button>
          </div>
          <div class="cart-item-details">
            <span>Cantidad: ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toLocaleString("es-CL")} CLP</span>
          </div>
        </div>
      `,
        )
        .join("")
    }
  }

  // Update totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (cartSubtotal) {
    cartSubtotal.textContent = `$${subtotal.toLocaleString("es-CL")} CLP`
  }
  if (cartTotal) {
    cartTotal.textContent = `$${subtotal.toLocaleString("es-CL")} CLP`
  }
}

function removeFromCart(productCode) {
  cart = cart.filter((item) => item.code !== productCode)
  localStorage.setItem("levelup-cart", JSON.stringify(cart))
  updateCartDisplay()
  showNotification("Producto eliminado del carrito", "info")
}

function clearCart() {
  if (cart.length === 0) return

  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    cart = []
    localStorage.setItem("levelup-cart", JSON.stringify(cart))
    updateCartDisplay()
    showNotification("Carrito vaciado", "info")
  }
}

// Product filtering
function setupProductFiltering() {
  // Initial display
  filterProducts("all")
}

function handleFilterClick(event) {
  const button = event.target
  const category = button.dataset.category

  filterProducts(category)
  updateFilterButtons(category)
}

function filterProducts(category) {
  currentFilter = category
  const products = document.querySelectorAll(".lu-product")

  products.forEach((product) => {
    const productCategory = product.dataset.category

    if (category === "all" || productCategory === category) {
      product.classList.remove("hidden")
      product.classList.add("fade-in")
    } else {
      product.classList.add("hidden")
      product.classList.remove("fade-in")
    }
  })
}

function updateFilterButtons(activeCategory) {
  document.querySelectorAll(".lu-filter-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.category === activeCategory) {
      btn.classList.add("active")
    }
  })
}

// Form validations
function setupFormValidations() {
  // Registration form
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    setupRegistrationValidation()
  }

  // Review form
  const reviewForm = document.getElementById("review-form")
  if (reviewForm) {
    setupReviewValidation()
  }
}

function setupRegistrationValidation() {
  const fields = {
    nombre: {
      element: document.getElementById("nombre"),
      validation: document.getElementById("nombre-validation"),
      validate: (value) => {
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres"
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El nombre solo puede contener letras"
        return null
      },
    },
    email: {
      element: document.getElementById("email"),
      validation: document.getElementById("email-validation"),
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Ingresa un correo válido"
        if (value.toLowerCase().endsWith("@duoc.cl")) {
          return "¡Correo Duoc detectado! Recibirás 20% de descuento"
        }
        return null
      },
    },
    fecha_nacimiento: {
      element: document.getElementById("fecha_nacimiento"),
      validation: document.getElementById("fecha-validation"),
      validate: (value) => {
        if (!value) return "La fecha de nacimiento es requerida"
        const birth = new Date(value)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--
        }

        if (age < 18) return "Debes ser mayor de 18 años"
        return null
      },
    },
    password: {
      element: document.getElementById("password"),
      validation: document.getElementById("password-validation"),
      validate: (value) => {
        if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres"
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Debe incluir mayúsculas, minúsculas y números"
        }
        return null
      },
    },
    password_confirm: {
      element: document.getElementById("password_confirm"),
      validation: document.getElementById("password-confirm-validation"),
      validate: (value) => {
        const password = document.getElementById("password").value
        if (value !== password) return "Las contraseñas no coinciden"
        return null
      },
    },
  }

  // Add real-time validation
  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName]
    if (field.element) {
      field.element.addEventListener("blur", () => validateField(field))
      field.element.addEventListener("input", () => validateField(field))
    }
  })
}

function validateField(field) {
  const value = field.element.value
  const error = field.validate(value)

  if (error) {
    field.validation.textContent = error
    field.validation.classList.remove("success")
    field.element.style.borderColor = "#ef4444"
    return false
  } else {
    if (value && field.validation.textContent.includes("Duoc")) {
      field.validation.classList.add("success")
    } else {
      field.validation.textContent = ""
      field.validation.classList.remove("success")
    }
    field.element.style.borderColor = "#22c55e"
    return true
  }
}

function setupReviewValidation() {
  const comentario = document.getElementById("comentario")
  const charCount = document.getElementById("char-count")

  if (comentario && charCount) {
    comentario.addEventListener("input", function () {
      const count = this.value.length
      charCount.textContent = count

      if (count > 500) {
        charCount.style.color = "#ef4444"
      } else if (count > 400) {
        charCount.style.color = "#f59e0b"
      } else {
        charCount.style.color = "var(--primary-color)"
      }
    })
  }
}

// Star rating functionality
function setupStarRating() {
  const stars = document.querySelectorAll(".star")
  const ratingInput = document.getElementById("rating-input")

  stars.forEach((star, index) => {
    star.addEventListener("click", function () {
      const rating = this.dataset.rating
      ratingInput.value = rating

      // Update visual state
      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add("active")
        } else {
          s.classList.remove("active")
        }
      })
    })

    star.addEventListener("mouseenter", function () {
      const rating = this.dataset.rating
      stars.forEach((s, i) => {
        if (i < rating) {
          s.style.color = "#ffd700"
        } else {
          s.style.color = "#666"
        }
      })
    })
  })

  // Reset on mouse leave
  document.getElementById("star-rating").addEventListener("mouseleave", () => {
    const currentRating = ratingInput.value
    stars.forEach((s, i) => {
      if (i < currentRating) {
        s.style.color = "#ffd700"
      } else {
        s.style.color = "#666"
      }
    })
  })
}

// Form submission handlers
function handleRegistration(event) {
  event.preventDefault()

  const form = event.target
  const submitBtn = document.getElementById("register-submit")
  const successDiv = document.getElementById("register-success")

  // Validate all fields
  let isValid = true
  const requiredFields = ["nombre", "email", "fecha_nacimiento", "password", "password_confirm"]

  requiredFields.forEach((fieldName) => {
    const field = document.getElementById(fieldName)
    if (!field.value.trim()) {
      isValid = false
      field.style.borderColor = "#ef4444"
    }
  })

  if (!isValid) {
    showNotification("Por favor completa todos los campos requeridos", "error")
    return
  }

  // Simulate form submission
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  setTimeout(() => {
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
    successDiv.style.display = "block"
    form.reset()
    showNotification("¡Cuenta creada exitosamente!", "success")

    setTimeout(() => {
      successDiv.style.display = "none"
    }, 5000)
  }, 2000)
}

function handleReviewSubmission(event) {
  event.preventDefault()

  const form = event.target
  const successDiv = document.getElementById("review-success")
  const producto = document.getElementById("producto-select").value
  const comentario = document.getElementById("comentario").value
  const rating = document.getElementById("rating-input").value

  if (!producto || !comentario || !rating) {
    showNotification("Por favor completa todos los campos", "error")
    return
  }

  // Simulate submission
  setTimeout(() => {
    successDiv.style.display = "block"
    form.reset()
    document.querySelectorAll(".star").forEach((s) => s.classList.remove("active"))
    document.getElementById("char-count").textContent = "0"
    showNotification("¡Reseña enviada exitosamente!", "success")

    setTimeout(() => {
      successDiv.style.display = "none"
    }, 5000)
  }, 1000)
}

function handleSupportSubmission(event) {
  event.preventDefault()

  const form = event.target
  const successDiv = document.getElementById("support-success")

  // Simulate submission
  setTimeout(() => {
    successDiv.style.display = "block"
    form.reset()
    showNotification("¡Mensaje enviado! Te responderemos pronto.", "success")

    setTimeout(() => {
      successDiv.style.display = "none"
    }, 5000)
  }, 1000)
}

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#22c55e"
      break
    case "error":
      notification.style.background = "#ef4444"
      break
    case "info":
      notification.style.background = "#3b82f6"
      break
    default:
      notification.style.background = "var(--primary-color)"
  }

  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})
