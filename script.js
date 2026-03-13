// =======================================================================
// 1. FUNCIÓN PARA CARGAR COMPONENTES HTML
// =======================================================================
async function cargarComponente(idContenedor, rutaArchivo) {
    try {
        const respuesta = await fetch(rutaArchivo);
        if (!respuesta.ok) throw new Error(`Error al cargar ${rutaArchivo}`);
        const html = await respuesta.text();
        document.getElementById(idContenedor).innerHTML = html;
    } catch (error) {
        console.error("Hubo un problema inyectando el componente:", error);
    }
}

// =======================================================================
// 2. INICIALIZACIÓN PRINCIPAL (Cuando carga la página)
// =======================================================================
document.addEventListener("DOMContentLoaded", async () => {
    
    // A. Cargar todos los componentes primero (usamos await para asegurar el orden)
    await cargarComponente("header-container", "components/Header.html");
    await cargarComponente("sidebar-container", "components/Sidebar.html");
    await cargarComponente("home-container", "components/Home.html");
    await cargarComponente("module1-container", "components/Module1.html");
    await cargarComponente("module2-container", "components/Module2.html");
    await cargarComponente("module3-container", "components/Module3.html");
    await cargarComponente("module4-container", "components/Module4.html");
    await cargarComponente("module5-container", "components/Module5.html");
    await cargarComponente("module6-container", "components/Module6.html");
    await cargarComponente("course-completed-container", "components/CourseCompleted.html");
    await cargarComponente("modal-container", "components/ResourceModal.html");

    // B. Ahora que todo el HTML existe en el DOM, inicializamos la lógica
    inicializarEventosDelCurso(); 
});


// =======================================================================
// 3. LÓGICA DEL CURSO E INTERACTIVIDAD
// =======================================================================
function inicializarEventosDelCurso() {
    
    // --- SELECTORES DEL DOM ---
    // (Ahora sí van a encontrar los elementos porque ya fueron inyectados)
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const navLinks = document.querySelectorAll("#nav-links a");
    const sections = document.querySelectorAll(".content-section");
    
    const logoLink = document.getElementById("logo-link");
    const homeBtn = document.getElementById("home-btn");
    const startCourseBtn = document.getElementById("start-course-btn");

    const resourceBtns = document.querySelectorAll(".resource-btn");
    const modalAlert = document.getElementById("resource-modal");
    const closeModalBtnAlert = document.querySelector(".close-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalLink = document.getElementById("modal-link");
    const navModuleBtns = document.querySelectorAll(".nav-module-btn");

    // --- LÓGICA DEL MENÚ LATERAL (SIDEBAR) ---
    function openMenu() {
        if(sidebar && overlay) {
            sidebar.classList.add("open");
            overlay.classList.add("active");
        }
    }

    function closeMenu() {
        if(sidebar && overlay) {
            sidebar.classList.remove("open");
            overlay.classList.remove("active");
        }
    }

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);


    // --- NAVEGACIÓN DESDE EL MENÚ LATERAL ---
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove("active-link"));
            this.classList.add("active-link");

            const targetId = this.getAttribute("data-target");
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });

            if (window.innerWidth <= 768) {
                closeMenu();
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });


    // --- VENTANA EMERGENTE (MODAL) ---
    if(modalAlert && modalTitle && modalLink) {
        resourceBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                modalTitle.textContent = this.getAttribute("data-title");
                modalLink.href = this.getAttribute("data-link");
                modalAlert.classList.add("active");
            });
        });

        if (closeModalBtnAlert) {
            closeModalBtnAlert.addEventListener("click", () => {
                modalAlert.classList.remove("active");
            });
        }

        modalAlert.addEventListener("click", (e) => {
            if (e.target === modalAlert) {
                modalAlert.classList.remove("active");
            }
        });
    }


    // --- BOTONES DE INICIO Y "EMPEZAR CURSO" ---
    function goToHome() {
        sections.forEach(section => section.classList.remove("active"));
        const homeSection = document.getElementById("home");
        if (homeSection) homeSection.classList.add("active");
        
        navLinks.forEach(l => l.classList.remove("active-link"));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (logoLink) logoLink.addEventListener("click", goToHome);
    if (homeBtn) homeBtn.addEventListener("click", goToHome);

    if (startCourseBtn) {
        startCourseBtn.addEventListener("click", () => {
            sections.forEach(section => section.classList.remove("active"));
            const module1 = document.getElementById("module1");
            if(module1) module1.classList.add("active");
            
            navLinks.forEach(l => l.classList.remove("active-link"));
            const module1Link = document.querySelector('a[data-target="module1"]');
            if (module1Link) module1Link.classList.add("active-link");
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- NAVEGACIÓN ENTRE MÓDULOS (BOTONES ANTERIOR / SIGUIENTE) ---
    navModuleBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const targetId = this.getAttribute("data-navigate");
            
            sections.forEach(section => section.classList.remove("active"));
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active");
            }
            
            navLinks.forEach(l => l.classList.remove("active-link"));
            
            if (targetId !== "course-completed") {
                const targetLink = document.querySelector(`a[data-target="${targetId}"]`);
                if (targetLink) {
                    targetLink.classList.add("active-link");
                }
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}