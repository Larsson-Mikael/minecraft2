import { 
    PerspectiveCamera, 
    Scene, 
    WebGLRenderer, 
    Clock,
} from 'three';

import SceneSubject from './SceneSubject';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';

class SceneManager
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.screen = {
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight,
        }

        this.cursorLocked = true;
        this.camera = this.buildCamera();
        this.scene = this.buildScene();
        this.renderer = this.buildRenderer(canvas);
        this.sceneSubjects = [];
    }

    buildCamera()
    {
        const fov = 70;
        const aspect = this.getAspect();
        const near = 0.1;
        const far = 1000;

        let camera = new PerspectiveCamera(fov, aspect, near, far);

        camera.position.z = 256;
        return camera;
    }

    buildScene()
    {
        let scene = new Scene();
        return scene;
    }

    buildRenderer(canvas)
    {
        let renderer = new WebGLRenderer({canvas});
        renderer.setClearColor(0x1F1F1F, 1);
        return renderer;
    }

    getAspect()
    {
        return this.screen.width / this.screen.height;
    }

    update(delta)
    {

        if(this.shouldResize())
        {
            this.camera.aspect = this.getAspect();
            this.camera.updateProjectionMatrix();
        }

        for(let i=0; i < this.sceneSubjects.length; i++)
        {
            this.sceneSubjects[i].update(elapsedTime);
        }

        this.renderer.render(this.scene, this.camera);
    }

    addSceneSubject(subject)
    {
        if(subject.update !== undefined)
        {
            this.sceneSubjects.push(subject);
        }

        this.scene.add(subject.mesh);
    }

    shouldResize()
    {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if(needResize)
        {
            this.screen = {width, height};
            this.renderer.setSize(width, height, false);
        }

        return needResize;
    }
}

export default SceneManager;
