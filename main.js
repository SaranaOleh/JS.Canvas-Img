'use strict';

class App{

    constructor(container){
        this.container = container;
        this.definitions();
        this.events();
    }

    definitions(){
        this.canvas = this.container.getElementsByTagName('canvas')[0];
        this.canvasField = this.canvas.getContext('2d');
        this.addBtn = this.container.querySelector('.addImg');
        this.delBtn = this.container.querySelector('.delImg');
        this.horizontalBtn = this.container.querySelector('.horizontal');
        this.verticalBtn = this.container.querySelector('.vertical');
        this.firstImg = this.container.querySelector('.firstImg');
        this.secondImg = this.container.querySelector('.secondImg');
        this.canvas.width = 0;
        this.canvas.height = 300;
        this.renderMode = "horizontal";
        this.imgStorage = {};
        this.preLoader = false;
    }

    events(){
        this.firstImg.addEventListener('change',function(){
            this.isValid(event.target);
        }.bind(this));
        this.secondImg.addEventListener('change',function () {
            this.isValid(event.target);
        }.bind(this));
        this.horizontalBtn.addEventListener('change',function () {
            this.toSwitch(event.target);
        }.bind(this));
        this.verticalBtn.addEventListener('change',function () {
            this.toSwitch(event.target);
        }.bind(this));
        this.addBtn.addEventListener('click',function () {
            this.toAdd();
        }.bind(this));
        this.delBtn.addEventListener('click',function () {
            this.toDelete();
        }.bind(this))
    }

    isValid(elem) {
        let upFile = elem.files[0];
        if(upFile === undefined){
            delete this.imgStorage[elem.dataset.id];
            this.loadImg();
        }
        else if( upFile.name.match(".*\.jpg")|| upFile.name.match(".*\.png") || upFile.name.match(".*\.gif")){
            this.loadImg(elem);
        }
        else{
            delete this.imgStorage[elem.dataset.id];
            this.loadImg();
            alert("Please select only images")
        }
    }

    toSwitch(elem){
        if(elem.className === "vertical"){
            this.canvas.height = 0;
            this.canvas.width = 300;
            this.renderMode = "vertical";
            this.loadImg();
        }
        else{
            this.canvas.height = 300;
            this.canvas.width = 0;
            this.renderMode = "horizontal";
            this.loadImg();
        }

    }

    toAdd() {
        if(this.preLoader) return;
        this.preLoader = true;
        let latest = this.container.querySelector('.images').querySelectorAll('input');
        let newBtn = document.createElement('input');
        newBtn.type = 'file';
        newBtn.accept = ".png, .gif, .jpeg, .jpg";
        newBtn.dataset.id = latest.length ? Number(latest[latest.length-1].dataset.id) + 1 : "1";
        this.container.querySelector('.images').appendChild(newBtn);
        newBtn.addEventListener('change',function(){
            this.isValid(event.target);
        }.bind(this));
        this.preLoader = false;
    }

    toDelete() {
        if(this.preLoader) return;
        this.preLoader = true;
        let latest = this.container.querySelector('.images').querySelectorAll('input');
        let elem = latest[latest.length-1];
        if(elem){
            this.container.querySelector('.images').removeChild(elem);
            delete this.imgStorage[elem.dataset.id];
            this.loadImg();
        }
        else{
            this.preLoader = false;
        }
    }

    loadImg(elem) {
        if(this.renderMode === "horizontal"){
            elem ? this.imgStorage[+elem.dataset.id] = elem.files[0] : null;
            let prevWidth = 0;
            if(!Object.keys(this.imgStorage).length) this.canvas.width = 0;
            let self = this;
            (function handle(i) {
                if (i >= Object.keys(self.imgStorage).length) return;
                let reader = new FileReader();
                reader.onload = function(){
                    let img = new Image();
                    img.src = reader.result;
                    img.addEventListener("load", function () {
                        if(+Object.keys(self.imgStorage)[i] === 1){
                            if(this.height < self.canvas.height){
                                let ratio = self.canvas.height / this.height;
                                self.canvas.width = this.width*ratio;
                                self.canvasField.drawImage(img,0,0,this.width*ratio, this.height*ratio);
                                prevWidth = this.width*ratio;
                            }
                            else{
                                let proc = this.height / self.canvas.height;
                                self.canvas.width = this.width/proc;
                                self.canvasField.drawImage(img,0,0,this.width/proc, this.height/proc);
                                prevWidth = this.width/proc;
                            }
                            handle(i+1);
                        }
                        else{
                            let oldCont = null;
                            if(prevWidth)  oldCont = self.canvasField.getImageData(0,0, prevWidth, self.canvas.height);
                            if(this.height < self.canvas.height){
                                let ratio = self.canvas.height / this.height;
                                self.canvas.width = prevWidth + this.width*ratio;
                                if(prevWidth) self.canvasField.putImageData(oldCont,0 ,0);
                                self.canvasField.drawImage(img,prevWidth,0,this.width*ratio, this.height*ratio);
                                prevWidth = prevWidth + this.width*ratio;
                            }
                            else{
                                let ratio = this.height / self.canvas.height;
                                self.canvas.width = prevWidth + this.width/ratio;
                                if(prevWidth) self.canvasField.putImageData(oldCont,0 ,0);
                                self.canvasField.drawImage(img,prevWidth,0,this.width/ratio, this.height/ratio);
                                prevWidth = prevWidth + this.width/ratio;
                            }
                            handle(i+1);
                        }
                    });
                };
                reader.readAsDataURL(Object.values(self.imgStorage)[i]);
            })(0);
            this.preLoader = false;
        }
        else{
            elem ? this.imgStorage[+elem.dataset.id] = elem.files[0] : null;
            let prevHeight = 0;
            if(!Object.keys(this.imgStorage).length) this.canvas.height = 0;
            let self = this;
            (function handle(i) {
                if (i >= Object.keys(self.imgStorage).length) return;
                let reader = new FileReader();
                reader.onload = function(){
                    let img = new Image();
                    img.src = reader.result;
                    img.addEventListener("load", function () {
                        if(+Object.keys(self.imgStorage)[i] === 1){
                            if(this.width < self.canvas.width){
                                let ratio = self.canvas.width / this.width;
                                self.canvas.height = this.height*ratio;
                                self.canvasField.drawImage(img,0,0,this.width*ratio, this.height*ratio);
                                prevHeight = this.height*ratio;
                            }
                            else{
                                let ratio = this.width / self.canvas.width;
                                self.canvas.height = this.height/ratio;
                                self.canvasField.drawImage(img,0,0,this.width/ratio, this.height/ratio);
                                prevHeight = this.height/ratio;
                            }
                            handle(i+1);
                        }
                        else{
                            let oldCont = null;
                            if(prevHeight)  oldCont = self.canvasField.getImageData(0,0, self.canvas.width, prevHeight);
                            if(this.width < self.canvas.width){
                                let ratio = self.canvas.width / this.width;
                                self.canvas.height = prevHeight + this.height*ratio;
                                if(prevHeight) self.canvasField.putImageData(oldCont,0 ,0);
                                self.canvasField.drawImage(img,0,prevHeight,this.width*ratio, this.height*ratio);
                                prevHeight = prevHeight + this.height*ratio;
                            }
                            else{
                                let ratio = this.width / self.canvas.width;
                                self.canvas.height = prevHeight + this.height/ratio;
                                if(prevHeight) self.canvasField.putImageData(oldCont,0 ,0);
                                self.canvasField.drawImage(img,0,prevHeight,this.width/ratio, this.height/ratio);
                                prevHeight = prevHeight + this.height/ratio;
                            }
                            handle(i+1);
                        }
                    });
                };
                reader.readAsDataURL(Object.values(self.imgStorage)[i]);
            })(0);
            this.preLoader = false;
        }
    }
}
let myApp = new App(document.querySelector('.container'));
let myApp2 = new App(document.querySelector('.container2'));