document.addEventListener("DOMContentLoaded", () => {
    
    // ================= SELECTORES DEL DOM =================
    // Elementos del menú y navegación
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const navLinks = document.querySelectorAll("#nav-links a");
    const sections = document.querySelectorAll(".content-section");
    
    // Elementos del encabezado y botones de inicio
    const logoLink = document.getElementById("logo-link");
    const homeBtn = document.getElementById("home-btn");
    const startCourseBtn = document.getElementById("start-course-btn");

    // Elementos de la ventana emergente (Modal)
    const resourceBtns = document.querySelectorAll(".resource-btn");
    const modalAlert = document.getElementById("resource-modal");
    const closeModalBtnAlert = document.querySelector(".close-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalLink = document.getElementById("modal-link");


    // ================= 1. LÓGICA DEL MENÚ LATERAL (SIDEBAR) =================
    function openMenu() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
    }

    function closeMenu() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }

    menuBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);


    // ================= 2. NAVEGACIÓN ENTRE MÓDULOS =================
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Actualizar estilo visual en el menú lateral
            navLinks.forEach(l => l.classList.remove("active-link"));
            this.classList.add("active-link");

            // Cambiar la sección visible
            const targetId = this.getAttribute("data-target");
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });

            // Auto-cerrar menú en dispositivos móviles
            if (window.innerWidth <= 768) {
                closeMenu();
            }

            // Scroll suave hacia arriba al cambiar de módulo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });


    // ================= 3. LÓGICA DE LA VENTANA EMERGENTE (MODAL) =================
    // Abrir modal e inyectar datos dinámicos
    resourceBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const title = this.getAttribute("data-title");
            const link = this.getAttribute("data-link");
            
            modalTitle.textContent = title;
            modalLink.href = link;
            
            modalAlert.classList.add("active");
        });
    });

    // Cerrar modal con el botón X
    closeModalBtnAlert.addEventListener("click", () => {
        modalAlert.classList.remove("active");
    });

    // Cerrar modal al hacer clic en el fondo oscuro
    modalAlert.addEventListener("click", (e) => {
        if (e.target === modalAlert) {
            modalAlert.classList.remove("active");
        }
    });


    // ================= 4. BOTONES PARA IR AL INICIO Y EMPEZAR CURSO =================
    
    // Función centralizada para volver al inicio
    function goToHome() {
        sections.forEach(section => section.classList.remove("active"));
        document.getElementById("home").classList.add("active");
        navLinks.forEach(l => l.classList.remove("active-link"));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Asignar función al Logo y botón "Inicio"
    if (logoLink) logoLink.addEventListener("click", goToHome);
    if (homeBtn) homeBtn.addEventListener("click", goToHome);

    // Lógica especial para el botón "Iniciar Curso"
    if (startCourseBtn) {
        startCourseBtn.addEventListener("click", () => {
            // Ocultar todas las secciones y mostrar el módulo 1
            sections.forEach(section => section.classList.remove("active"));
            document.getElementById("module1").classList.add("active");
            
            // Marcar visualmente el Módulo 1 en el menú
            navLinks.forEach(l => l.classList.remove("active-link"));
            const module1Link = document.querySelector('a[data-target="module1"]');
            if (module1Link) {
                module1Link.classList.add("active-link");
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================= 5. BOTONES DE SIGUIENTE MÓDULO =================
    const nextBtns = document.querySelectorAll(".next-btn");

    nextBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            // Obtenemos a qué módulo debemos ir
            const targetId = this.getAttribute("data-next");
            
            // 1. Ocultamos todas las secciones
            sections.forEach(section => section.classList.remove("active"));
            
            // 2. Mostramos la sección destino
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active");
            }
            
            // 3. Quitamos la selección del menú lateral
            navLinks.forEach(l => l.classList.remove("active-link"));
            
            // 4. Si NO es la pantalla final, iluminamos el módulo correspondiente en el menú
            if (targetId !== "course-completed") {
                const nextLink = document.querySelector(`a[data-target="${targetId}"]`);
                if (nextLink) {
                    nextLink.classList.add("active-link");
                }
            }
            
            // 5. Scroll suave hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});