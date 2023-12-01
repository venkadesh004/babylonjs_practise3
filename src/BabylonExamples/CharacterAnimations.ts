import { CubeTexture, Engine, FreeCamera, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";

export class CharacterAnimations {
    scene: Scene;
    engine: Engine;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.CreateEnvironment();
        this.CreateCharacter();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        
        const envTex = CubeTexture.CreateFromPrefilteredData(
            "./environment/sky.env",
            scene
        );

        envTex.gammaSpace = false;
        envTex.rotationY = Math.PI/2;
        
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true, 1000, 0.25);

        const camera = new FreeCamera(
            "camera",
            new Vector3(0, 2, -10),
            this.scene
        );
        camera.attachControl();
        camera.minZ = 0.5;
        camera.speed = 0.5;
        
        return scene;
    }

    async CreateEnvironment(): Promise<void> {
        await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "Prototype_Level_new.glb"
        );
    }

    async CreateCharacter(): Promise<void> {
        const {meshes, animationGroups} = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "character.glb"
        );

        meshes[0].rotate(Vector3.Up(), Math.PI, 0);

        animationGroups[0].stop();

        
    }
}