

(function() {


    const rootScrollableElement = document.querySelector(".root");

    /**
     * Menu behavior
     */
    class Toggler {
        constructor(element, anchor, classname) {
            this.el = element;
            this.anchor = anchor || element;
            this.classname = classname || "is-sticked";
            this._sticked = false;

            const that = this;
            // rootScrollableElement
            document.addEventListener("scroll", () => { that.onScroll() });
        }

        get sticked() {
            return this._sticked;
        }

        set sticked(val) {
            if (val === true) {
                this.el.classList.add(this.classname);
                this._sticked = true;
            } else {
                this.el.classList.remove(this.classname);
                this._sticked = false;
            }
        }

        get anchorHidden() {
            const box = this.anchor.getBoundingClientRect();
            const pageY = window.pageYOffset;
            return box.top + this.anchor.offsetHeight <= 0;
        }

        onScroll() {
            this.checkState();
        }

        checkState() {
            if (this.anchorHidden && !this.sticked) {
                this.sticked = true;
            } if (!this.anchorHidden && this.sticked) {
                this.sticked = false;
            }
        }
    }

    let menuToggler = new Toggler(
        document.querySelector("#topMenu"),
        document.querySelector("#cta-1"),
        "is-sticked"
    );



    /**
     * Vertical scrolling gallery
     */

    class ScrollingGallery {
        constructor(main, cont, gallery, num) {
            this.main = main;
            this.cont = cont;
            this.gallery = gallery;

            // Amount of slides
            this.num = num;

            // Elements that should be animated
            this.a = {
                dots: this.gallery.querySelectorAll('.note-w-text .dots--item'),
                slides: this.gallery.querySelectorAll('.note-w-text .slider--item'),
                texts: this.gallery.querySelectorAll('.note-w-text .text-section--item'),
            };

            // Style preparations
            this.cont.style.position = "relative";
            this.sticky(false); // position: absolute; top: 0; left: 0; right: 0

            // Seting the gallery container size  
            this.setupContainer();

            // Return to prev Scroll position (if it was saved in localStorage before) 
            if (this.isLocalStorageAvailable()) {
                const prevScrollPos = localStorage.getItem("curScroll") || 0;
                if (prevScrollPos > 0) {
                    // this.main.scrollTo({
                    window.scrollTo({
                        top: prevScrollPos
                    })
                }
            }

            // Listeners
            this.scrollListener = this.main.addEventListener(
                "scroll",
                this.onScroll.bind(this)
            );

            this.resizeListener = window.addEventListener(
                "resize",
                this.resize.bind(this)
            );


            this.onScroll();
        }

        // Scroll event handler
        onScroll(e) {
            const scrollTop = this.main.scrollTop,
                contSize = this.cont.getBoundingClientRect(),
                gallerySize = this.gallery.getBoundingClientRect();

            let newPos = (window.innerHeight - gallerySize.height) / 2 - contSize.top;


            if (newPos > contSize.height - gallerySize.height) {
                // Stick to the bottom of container
                newPos = contSize.height - gallerySize.height;
                this.sticky(false);
                this.move(newPos);
            } else if (newPos <= 0) {
                // Stick to the top of container
                newPos = 0;
                this.sticky(false);
                this.move(newPos);
            } else {
                this.sticky(true);
            }

            this.animate(newPos);

            // Store the scroll position for page reload cases
            if (this.isLocalStorageAvailable()) {
                localStorage.curScroll = this.main.scrollTop;
            }
        }

        // Moving gallery through its container
        move(pos) {
            this.gallery.style.transform = `translateY(${pos}px)`;
        }

        // Main animations appearing in a gallery item while scrolling 
        animate(pos) {
            this.animateText(pos);

            const h = this.cont.getBoundingClientRect().height,
                curSlide = Math.floor((pos / h) * (this.num + 1));
            // num + 1 - is inreased in order to let the last slide be vissible enough time


            // Some very custom things below
            if (!this.prevSlide || this.prevSlide != curSlide) {
                // Dots
                this.a.dots.forEach((item, i) => {
                    item.classList.remove("dots--item_active");
                    if (i == curSlide) {
                        item.classList.add("dots--item_active");
                    }
                });

                // Slides
                this.a.slides.forEach((item, i) => {
                    item.classList.remove("slider--item_active");
                    if (i == curSlide) {
                        item.classList.add("slider--item_active");
                    }
                });

                this.prevSlide = curSlide;
            }
        }

        // Posess all text items in gallery according to current scroll position
        // 0 <= pos <= 1
        animateText(pos) {
            /**
             * Text
             */
            const posShare = pos / this.cont.getBoundingClientRect().height,
                textSlides = document.querySelectorAll(".text-section--item"),
                num = this.num,
                textContHeight = textSlides[0].parentElement.getBoundingClientRect().height;

            const step = 1 / num,
                k = 5; // ????????????????????

            textSlides.forEach((item, i) => {
                const dif = i * step - posShare;

                const h = item.getBoundingClientRect().height;
                let dy = dif * h * k;

                const newPos = textContHeight / 2 + dy;

                item.style.top = `${newPos}px`;

                let op = newPos - .5 * textContHeight;
                op = Math.abs(op);
                op = op > .5 * textContHeight
                    ? .5 * textContHeight
                    : op;
                op = 1 - Math.pow(op / (.5 * textContHeight), 2);

                item.style.opacity = op;
                // item.style.transform = `translateY(-50%) scale(${op})`;
            });
        }

        // Checking if Local storage is available
        isLocalStorageAvailable() {
            var test = 'test';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        }

        // Making gallery fixed in the center of viewport 
        // if we are scrolling through it right now
        sticky(makeSticky) {
            const isSticky = this.gallery.style.position === "fixed";
            if (isSticky && !makeSticky) {
                this.gallery.style.position = "absolute";
                this.gallery.style.top = "0";
                this.gallery.style.left = "0";
                this.gallery.style.right = "0";
                return true;
            }

            if (!isSticky && makeSticky) {
                this.gallery.style.position = "fixed";
                this.gallery.style.left = "0%";
                this.gallery.style.right = "0%";
                this.gallery.style.top = "50%";
                this.gallery.style.transform = "translateY(-50%)";
                return true;
            }

            return false;
        }

        resize() {
            this.setupContainer();
            this.onScroll();
        }

        setupContainer() {
            const galleryHeight = this.gallery.getBoundingClientRect().height;

            this.cont.style.height = `${this.num * galleryHeight}px`;
        }
    }

    let scrollingGallery = new ScrollingGallery(
        // rootScrollableElement,
        document,
        document.querySelector(".possibilities"),
        document.querySelector(".possibilities--cont"),
        6
    );

    /**
     * On screen appearing animations 
     */
    try {
        AOS?.init({});

        // Add Styles
        var css = document.createElement('link');
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("href", "./css/aos.css");
        document.getElementsByTagName("head")[0].appendChild(css);
    } catch(e) {
        throw new Error("Looks like AOS is not defined");
    }

    /**
     * Modal
     */
    document.querySelectorAll(".b-button").forEach(el => {
        el.addEventListener("click", e => {
            const id = e.currentTarget.getAttribute("data-target") || "modalForm";
            document.getElementById(id).classList.add("is-active");
            document.getElementsByTagName("html")[0].classList.add("is-clipped");
        });
    });

    const closeMe = e => {
        e.preventDefault();
        e.currentTarget.closest(".modal")?.classList?.remove("is-active");
        document.getElementsByTagName("html")[0].classList.remove("is-clipped");
    }

    document.querySelectorAll(".modal-background").forEach(el => {
        el.addEventListener("click", closeMe)
    });

    document.querySelectorAll(".modal-close").forEach(el => {
        el.addEventListener("click", closeMe)
    });



    
    /**
     * Form
     */
    listenForm("#presentationForm");

    function isEmail(email) {
        var emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-_.+-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(email);
    }
    
    function changeButton(company, name, mail, phone, form) {
        
        if (!company || !name || !mail || !phone) {
            form.find("button").prop('disabled', true);
            return false;
        }

        form.find("button").prop('disabled', false);
        return true;
    }

    var isGoodCompany = false,
        isGoodName = false,
        isGoodMail = false,
        isGoodPhone = false;

    function listenForm(formID) {
        var f = $(formID);
        var company = f.find("input[name='company']:first");
        var name = f.find("input[name='name']:first");
        var email = f.find("input[name='email']:first");
        var phone = f.find("input[name='phone']:first");

        // var isGoodCompany = false;
        // var isGoodName = false;
        // var isGoodMail = false;
        // var isGoodPhone = false;
        
        var setState = function(el, state, text) {
            const control = el.closest(".control");

            if (state) {
                // Input border
                el.removeClass("is-danger").addClass("is-success");

                // Right icon
                control.addClass("has-icons-right");
                control.find(".is-right").remove();
                $(`<span class="icon is-small is-right"><i class="fas fa-check"></i></span>`)
                    .appendTo(control);

                // Text
                control.find("p.help").remove();
                if (!!text && text.length) {
                    $(`<p class="help is-success">${text}</p>`)
                        .appendTo(control);
                } 
            } else {
                // Input border
                el.removeClass("is-success").addClass("is-danger");

                // Right icon
                control.addClass("has-icons-right");
                control.find(".is-right").remove();
                $(`<span class="icon is-small is-right"><i class="fas fa-exclamation-triangle"></i></span>`)
                    .appendTo(control);
                    
                // Text
                control.find("p.help").remove();
                if (!!text && text.length) {
                    $(`<p class="help is-danger">${text}</p>`)
                        .appendTo(control);
                }
            }
        }

        company.on("input", function () {
            if ($(this).val() == "") {
                setState($(this), false, null);
                isGoodCompany = false;
            } else {
                setState($(this), true, null);
                isGoodCompany = true;
            }
            changeButton(isGoodCompany, isGoodName, isGoodMail, isGoodPhone, f);
        });

        name.on("input", function () {
            if ($(this).val() == "") {
                setState($(this), false, null);
                isGoodName = false;
            } else {
                setState($(this), true, null);
                isGoodName = true;
            }
            changeButton(isGoodCompany, isGoodName, isGoodMail, isGoodPhone, f);
        });
        
        email.on("input", function () {
            var userText = $(this).val();

            if (userText == "") {
                setState($(this), false, "??????????????, ????????????????????, ?????????????????????? ??????????");
                isGoodMail = false;
            } else if (!isEmail(userText)) {
                setState($(this), false, "???????????????????????? ???????????? ??????????");
                isGoodMail = false;
            } else {
                setState($(this), true, null);
                isGoodMail = true;
            }

            changeButton(isGoodCompany, isGoodName, isGoodMail, isGoodPhone, f);
        });

        
        phone.on("input", function () {
            if ($(this).val() == "") {
                setState($(this), false, null);
                isGoodPhone = false;
            } else {
                setState($(this), true, null);
                isGoodPhone = true;
            }
            changeButton(isGoodCompany, isGoodName, isGoodMail, isGoodPhone, f);
        });

        f.on("submit", function (e) {
            e.preventDefault();
            
            changeButton(isGoodCompany, isGoodName, isGoodMail, isGoodPhone, f);

            if (!!$(this).find("button").prop('disabled')) {
                return;
            }

            formSubmit($(this));
        });
    }

    function formSubmit(form) {
        if (!!form.find("button").prop('disabled')) {
            return;
        }

        $.post(
            "sendMail.php",
            form.serializeArray(),
            function (data) {
                const blockEl = form.closest(".modal-content").find(".block:first");
                
                if (data.result) {
                    blockEl
                        .find(".notification")
                        .remove();
                    
                    const message = $(`
                        <div class="notification mt-4 is-success is-size-7">
                            C????????????. ???????????? ?????????????? ????????????????????. 
                            ???????????????? ???????????????? ?? ???????? ?? ?????????????????? ??????????.
                        </div>`
                    );
                    message.appendTo(blockEl);

                    form.trigger("reset");
                    isGoodCompany = false;
                    isGoodName = false;
                    isGoodMail = false;
                    isGoodPhone = false;
                    changeButton(isGoodCompany, isGoodName, isGoodMail, isGoodPhone, form);
                } else {
                    blockEl
                        .find(".notification")
                        .remove()
                        .end()
                        .append(`
                            <div class="notification mt-4 is-danger is-size-7">
                                ${data.errors}
                            </div>
                        `);
                }
            },
            "json"
        );

    }

})()