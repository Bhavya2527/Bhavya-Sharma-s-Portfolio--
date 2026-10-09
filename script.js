document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");
    const scrollProgress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const year = document.getElementById("year");

    const modal = document.getElementById("projectModal");
    const modalClose = document.getElementById("modalClose");
    const modalTitle = document.getElementById("modalTitle");
    const modalCategory = document.getElementById("modalCategory");
    const modalDescription = document.getElementById("modalDescription");
    const modalTags = document.getElementById("modalTags");
    const modalNote = document.getElementById("modalNote");

    let lastFocusedElement = null;

    // Update copyright year automatically.
    year.textContent = new Date().getFullYear();

    // Mobile navigation.
    function closeMenu() {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Toggle navigation");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Toggle navigation"
        );
    });

    navItems.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            navLinks.classList.contains("open") &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Scroll effects: navbar, progress bar and back-to-top button.
    function handleScroll() {
        const scrollTop = window.scrollY;
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        navbar.classList.toggle("scrolled", scrollTop > 30);
        backToTop.classList.toggle("visible", scrollTop > 500);

        const progress =
            scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

        scrollProgress.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });
    handleScroll();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Reveal sections when they enter the viewport.
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("visible"));
    }

    // Highlight the navigation link for the current section.
    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navItems.forEach((link) => {
                        const isCurrent = link.getAttribute("href") === `#${currentId}`;
                        link.classList.toggle("active", isCurrent);
                    });
                });
            }, {
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    // Project information for the modal.
    const projectData = {
        gym: {
            category: "PROJECT / 01",
            title: "Gym Fee Management System",
            description: "A project focused on organizing gym member information and fee-payment records to make routine gym fee management easier. Update this description with the exact features and technologies you actually implemented.",
            tags: ["Management System", "Member Records", "Fee Tracking"],
            note: "Portfolio note: add your actual tech stack and implemented features here. Don't list features that aren't part of your project."
        },

        skills: {
            category: "PROJECT / 02 · HACKATHON",
            title: "Skill Gap Analysis Platform",
            description: "A platform concept focused on identifying gaps between industry requirements and existing skills, while helping understand skill development and employment outcomes. I presented this project at the Smart India Hackathon (SIH) as part of Team Codex.",
            tags: [
                "Smart India Hackathon",
                "Skill Gap Analysis",
                "UI/UX",
                "Team Project"
            ],
            note: "This project was presented at SIH. This description does not imply that the team won or was selected for a later round."
        },

        portfolio: {
            category: "PROJECT / 03 · WEB DEVELOPMENT",
            title: "Personal Portfolio",
            description: "My personal portfolio website, built to introduce my background, education, technical interests and projects. It includes a responsive layout, animated sections and interactive project details.",
            tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
            note: "This website is designed to evolve as I learn new technologies and build more projects."
        }
    };

    // Open the modal with the selected project's information.
    function openProject(projectKey, triggerElement) {
        const project = projectData[projectKey];

        if (!project) return;

        lastFocusedElement = triggerElement;

        modalCategory.textContent = project.category;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        modalNote.textContent = project.note;

        modalTags.replaceChildren();

        project.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.textContent = tag;
            modalTags.appendChild(tagElement);
        });

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        modalClose.focus();
    }

    function closeProjectModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll(".project-card[data-project]").forEach((card) => {
        card.addEventListener("click", () => {
            openProject(card.dataset.project, card);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProject(card.dataset.project, card);
            }
        });
    });

    modalClose.addEventListener("click", closeProjectModal);

    modal.querySelectorAll("[data-close-modal]").forEach((element) => {
        element.addEventListener("click", closeProjectModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            closeProjectModal();
        }
    });
});
