import { Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, CubeTexture, PBRMaterial, Texture, GlowLayer } from "@babylonjs/core";

export class PBR {

    scene: Scene;
    engine: Engine

    constructor(private canvas: HTMLCanvasElement | null) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene() : Scene {
        const scene = new Scene(this.engine);

        const camera = new FreeCamera(
            'camera',
            new Vector3(0, 1, -5),
            this.scene
        );
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight(
            'hemiLight',
            new Vector3(0, 1, 0),
            this.scene
        );
        hemiLight.intensity = 0;

        const envTex = CubeTexture.CreateFromPrefilteredData(
            "./environment/sky.env",
            scene
        );

        scene.environmentTexture = envTex;

        scene.createDefaultSkybox(envTex, true);

        const ground = MeshBuilder.CreateGround(
            'ground',
            {
                width: 10,
                height: 10
            },
            this.scene
        );

        const ball = MeshBuilder.CreateSphere(
            'ball',
            {
                diameter: 1
            },
            this.scene
        );

        ball.position = new Vector3(0, 1, 0);

        ground.material = this.CreateAsphalt();

        return scene;
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

    CreateMagic(): PBRMaterial {
        const pbr = new PBRMaterial("pbr", this.scene);

        pbr.albedoTexture = new Texture(
            "./textures/metal/metal_diffuse.jpg",
            this.scene
        );

        const uvScale = 1;
        const texArray: Texture[] = [];

        const normalTex = new Texture("./textures/metal/metal_normal.jpg", this.scene);

        pbr.bumpTexture = normalTex;
        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;
        texArray.push(normalTex);

        const aoTex = new Texture("./textures/metal/metal_ao.jpg", this.scene);

        pbr.ambientTexture = aoTex;
        texArray.push(aoTex);

        const glowLayer = new GlowLayer("glow", this.scene);
        glowLayer.intensity = 1;

        texArray.forEach((tex) => {
            tex.uScale = uvScale;
            tex.vScale = uvScale;
        });

        pbr.roughness = 1;

        return pbr;
    }
}