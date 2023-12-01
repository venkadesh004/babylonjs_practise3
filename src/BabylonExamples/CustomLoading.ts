import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    MeshBuilder,
    CubeTexture,
    SceneLoader,
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
  
  export class CustomLoading {
    scene: Scene;
    engine: Engine;
    loadingScreen: CustomLoadingScreen;
  
    constructor(
        private canvas: HTMLCanvasElement,
        private setLoaded: () => void,
        private loadingBar: HTMLElement,
        private percentLoaded: HTMLElement,
        private loader: HTMLElement
    ) {
      this.engine = new Engine(this.canvas, true);

      this.loadingScreen = new CustomLoadingScreen(
        this.loadingBar,
        this.percentLoaded,
        this.loader
      );

        // this.engine.displayLoadingUI();

      this.scene = this.CreateScene();
  
      this.CreateEnvironment();
  
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);
      const camera = new FreeCamera(
        "camera",
        new Vector3(0, 0.75, -8),
        this.scene
      );
      camera.attachControl();
      camera.speed = 0.25;
  
      const envTex = CubeTexture.CreateFromPrefilteredData(
        "./environment/sky.env",
        scene
      );
  
      scene.environmentTexture = envTex;
  
      scene.createDefaultSkybox(envTex, true);
  
      scene.environmentIntensity = 0.5;
  
      return scene;
    }
  
  
    
  
    async CreateEnvironment(): Promise<void> {
      await SceneLoader.ImportMeshAsync(
        "",
        "./model/",
        "LightingScene.glb"
      );

      this.setLoaded();
  
        // this.engine.hideLoadingUI(); 
    }
  }