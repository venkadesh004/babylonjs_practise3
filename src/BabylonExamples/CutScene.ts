import { AnimationGroup, CubeTexture, Engine, FreeCamera, Scene, Vector3, SceneLoader, Animation } from "@babylonjs/core";
import "@babylonjs/loaders";

export class CutScene {
    scene: Scene;
    engine: Engine;
    characterAnimations!: AnimationGroup[];
    camera!: FreeCamera;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.CreateEnvironment();
        this.CreateCharacter();
        this.CreateZombies();
        this.CreateCutScene();

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
        camera.minZ = 0.5;
        camera.speed = 0.5;

        this.camera = camera;
        
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
            "character_new.glb"
        );

        meshes[0].rotate(Vector3.Up(), -Math.PI/2);
        meshes[0].position = new Vector3(8, 0, -4);

        this.characterAnimations = animationGroups;

        this.characterAnimations[0].stop();
        this.characterAnimations[1].play();
    }

    async CreateZombies(): Promise<void> {
        const zombieOne = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "zombie_1.glb"
        );

        const zombieTwo = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "zombie_2.glb"
        );

        zombieOne.meshes[0].rotate(Vector3.Up(), Math.PI/2);
        zombieOne.meshes[0].position = new Vector3(-8, 0, -4);
        zombieTwo.meshes[0].rotate(Vector3.Up(), Math.PI/2);
        zombieTwo.meshes[0].position = new Vector3(-6, 0, -2);
    }

    async CreateCutScene(): Promise<void> {
        const camKeys = [];
        const fps = 60;

        const camAnim = new Animation(
            "camAnim",
            "position",
            fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            true
        ); 

        camKeys.push({
            frame: 0,
            value: new Vector3(8, 2, -8)
        });

        camKeys.push({
            frame: 5*fps,
            value: new Vector3(-8, 2, -8)
        });

        camKeys.push({
            frame: 8*fps,
            value: new Vector3(-8, 2, -8)
        });

        camKeys.push({
            frame: 12*fps,
            value: new Vector3(0, 3, -16)
        });

        camAnim.setKeys(camKeys);
        this.camera.animations.push(camAnim);

        await this.scene.beginAnimation(this.camera, 0, 12*fps).waitAsync();

        this.EndCutScene();
    }

    EndCutScene(): void {
        this.camera.attachControl();
        this.characterAnimations[1].stop();
        this.characterAnimations[0].play();
    }
}