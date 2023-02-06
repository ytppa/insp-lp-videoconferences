// AOS.init({
//     startEvent: 'customScroll'
// });


(function () {

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

    //#region ScrollingGallery
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
            this.gallery.style.position = "absolute";
            this.gallery.style.top = "0";
            this.gallery.style.left = "0";
            this.gallery.style.right = "0";

            // Seting the gallery container size  
            this.setupContainer();

            // Return to prev Scroll position (if it was saved in localStorage before) 
            const prevScrollPos = localStorage.getItem("curScroll") || 0;
            if (prevScrollPos > 0) {
                this.main.scrollTo({
                    top: prevScrollPos
                })
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

        onScroll(e) {
            const scrollTop = this.main.scrollTop,
                contSize = this.cont.getBoundingClientRect(),
                gallerySize = this.gallery.getBoundingClientRect(),
                mainSize = this.main.getBoundingClientRect();

            let newPos = (window.innerHeight - gallerySize.height) / 2 - contSize.top;
            

            if (newPos > contSize.height - gallerySize.height) {
                // Stick to the bottom of container
                newPos = contSize.height - gallerySize.height;
            } else if (newPos <= 0) {
                // Stick to the top of container
                newPos = 0;
            } 

            this.move(newPos);
            this.animate(newPos);

            // Store the scroll position for page reload cases
            localStorage.curScroll = this.main.scrollTop;
        }

        move(pos) {
            this.gallery.style.transform = `translateY(${pos}px)`;
        }

        animate(pos) {
            const h = this.cont.getBoundingClientRect().height,
                curSlide = Math.floor((pos / h) * (this.num + 1)); 
                // num + 1 - is inreased in order to let the last slide be vissible enough time
            

            // Some very custom things below
            if (!this.prevSlide || this.prevSlide != curSlide) {
                console.log(`~ Slide ${curSlide}`);

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

                // Texts 
                this.a.texts.forEach((item, i) => {
                    item.classList.remove("text-section--item_active");
                    if (i == curSlide) {
                        item.classList.add("text-section--item_active");
                    }
                });

                this.prevSlide = curSlide;
            }
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
    //#endregion ScrollingGallery

    let scrollingGallery = new ScrollingGallery(
        document.querySelector(".root"),
        document.querySelector(".possibilities"),
        document.querySelector(".possibilities--cont"),
        6
    )

})()