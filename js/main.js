AOS.init();


(function(){

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
            document.addEventListener("scroll", () => {that.onScroll()});
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
    const scrollingContainer = document.querySelector(".note-w-text");

    const process_touchstart = e => console.log("~ touchstart");
    const process_touchcancel = e => console.log("~ touchcancel");
    const process_touchend = e => console.log("~ touchend");
    const process_touchmove = e => {
        switch (e.touches.length) {
            case 1: console.log(`handle_one_touch`, e); break;
            case 2: console.log(`handle_two_touches`, e); break;
            case 3: console.log(`handle_three_touches`, e); break;
            default: console.log(`gesture_not_supported`, e); break;
        }
        console.log("~ touchmove");
    }

    scrollingContainer.addEventListener("touchstart", process_touchstart, false);
    scrollingContainer.addEventListener("touchmove", process_touchmove, false);
    scrollingContainer.addEventListener("touchcancel", process_touchcancel, false);
    scrollingContainer.addEventListener("touchend", process_touchend, false);

    //#region ScrollingGallery
    class ScrollingGallery {
        constructor(main, cont, gallery, num) {
           this.main = main;
           this.cont = cont;
           this.gallery = gallery;
     
           /**
            * In this example will show 4 different key state for the gallery.
            * We'll decide that the container ("timeline") should be
            * in 4 times large than the gallery.
            */
           this.num = num;
     
           this.init();
     
           this.scrollListener = this.main.addEventListener(
              "scroll",
              this.onScroll.bind(this)
           );
     
           this.resizeListener = window.addEventListener(
              "resize",
              this.resize.bind(this)
           );
        }
     
        onScroll(e) {
           const scrollTop = this.main.scrollTop,
              contSize = this.cont.getBoundingClientRect(),
              gallerySize = this.gallery.getBoundingClientRect(),
              mainSize = this.main.getBoundingClientRect();
     
           let newPos = (window.innerHeight - gallerySize.height) / 2 - contSize.top;
     
           if (newPos > 0 && newPos < contSize.height - gallerySize.height) {
              // Center of screen
              this.move(newPos);
           } else if (newPos <= 0) {
              // Stick to the top of container
              this.move(0);
           } else {
              // Stick to the bottom of container
              this.move(contSize.height - gallerySize.height);
           }
        }
     
        move(y) {
           console.log(`move ${y}`);
     
           this.gallery.style.transform = `translate(-50%, ${y}px)`;
     
           /**
            * Imitating some gallery state changes during scroll
            * We'll dynamically change the background
            */
           const contHeight = this.cont.getBoundingClientRect().height;
     
           this.gallery.style.background = `hsl(${
              (y * 100) / contHeight
           }, 50%, 50%)`;
     
           this.gallery.innerHTML = `${Math.floor(y)}px`;
        }
     
        resize() {
           console.log(`~ resize`);
           this.init();
        }
     
        init() {
           console.log(`~ init`);
           const galleryHeight = this.gallery.getBoundingClientRect().height;
     
           this.cont.style.height = `${this.num * galleryHeight}px`;
           this.onScroll();
        }
    }
    //#endregion ScrollingGallery
    // let scrollingGallery = new ScrollingGallery(
    //     document.querySelector(".main"),
    //     document.querySelector(".gallery"),
    //     document.querySelector(".gallery--main"),
    //     4
    // )

})()