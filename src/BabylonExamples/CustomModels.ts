import { Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, CubeTexture, PBRMaterial, Texture, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";

export class CustomModels {

    scene: Scene;
    engine: Engine

    constructor(private canvas: HTMLCanvasElement | null) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        // this.CreateGround();
        this.CreateBarrel();
        this.CreateCampfire();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene() : Scene {
        const scene = new Scene(this.engine);

        const camera = new FreeCamera(
            'camera',
            new Vector3(0, 0.75, -8),
            this.scene
        );
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight(
            'hemiLight',
            new Vector3(0, 1, 0),
            this.scene
        );
        hemiLight.intensity = 0.5;

        const envTex = CubeTexture.CreateFromPrefilteredData(
            "./environment/sky.env",
            scene
        );
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);
        scene.environmentIntensity = 1;

        return scene;
    }

    CreateGround(): void {
        const ground = MeshBuilder.CreateGround(
            "ground",
            {width: 10, height: 10},
            this.scene
        );

        ground.material = this.CreateAsphalt();
    }

    CreateAsphalt(): PBRMaterial {
        const pbr = new PBRMaterial("pbr", this.scene);

        pbr.albedoTexture = new Texture(
            "./textures/asphalt/asphalt_diffuse.jpg",
            this.scene
        );

        pbr.bumpTexture = new Texture(
            "./textures/asphalt/asphalt_normal.jpg",
            this.scene
        );
        
        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;
        
        pbr.useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true;

        pbr.metallicTexture = new Texture(
            "./textures/asphalt/asphalt_arm.jpg",
            this.scene
        );

        pbr.roughness = 1;

        return pbr;
    }

    async CreateBarrel(): Promise<void> {
        // SceneLoader.ImportMesh(
        //     '',
        //     './model/',
        //     'barrel.glb',
        //     this.scene,
        //     (meshes) => {
        //         console.log('meshes', meshes);
        //     }
        // );
        const {meshes} = await SceneLoader.ImportMeshAsync(
            '',
            './model/',
            'barrel.glb'
        );

        console.log("Models", meshes);
    }

    async CreateCampfire(): Promise<void> {
        const {meshes} = await SceneLoader.ImportMeshAsync(
            '',
            './model/',
            'campfire.glb'
        );

        console.log("Model", meshes);
    }
}