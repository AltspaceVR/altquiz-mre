/*!
 * Copyright (c) Ben Garfield. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';

interface Resource {
	container: MRE.AssetContainer;
	mainAsset?: MRE.Asset;
}

export default class SharedAssets {
	private resources: { [name: string]: Resource } = {};

	public get answerButton() {
		return this.resources.answerButton.mainAsset as MRE.Prefab;
	}
	public get logo() {
		return this.resources.logo.mainAsset as MRE.Material;
	}
	public get screen() {
		return this.resources.screen.mainAsset as MRE.Prefab;
	}
	public get screenBorderMat() {
		return this.resources.screen.container.materials.find(m => m.name === 'border');
	}
	public get sqaureButton() {
		return this.resources.squareButton.mainAsset as MRE.Prefab;
	}
	public get back() {
		return this.resources.back.mainAsset as MRE.Material;
	}

	public get sounds(): { [name: string]: MRE.Sound } {
		return {
			buzz: this.resources.buzz.mainAsset as MRE.Sound,
			correct: this.resources.correct.mainAsset as MRE.Sound,
			wrong: this.resources.wrong.mainAsset as MRE.Sound,
			rise: this.resources.rise.mainAsset as MRE.Sound,
			ticktock: this.resources.ticktock.mainAsset as MRE.Sound,
			click: this.resources.click.mainAsset as MRE.Sound
		};
	}

	public load(context: MRE.Context, baseUrl: string): Promise<void> {
		const promises: Array<Promise<void>> = [];
		let r: Resource;
		let p: Promise<void>;

		// load logo
		r = { container: new MRE.AssetContainer(context) } as Resource;
		this.resources.logo = r;
		r.mainAsset = r.container.createMaterial('logo', {
			mainTextureId: r.container.createTexture('logo', {
				uri: baseUrl + '/textures/logo.png'
			}).id,
			alphaMode: MRE.AlphaMode.Blend,
			alphaCutoff: 0.5
		});
		promises.push(r.mainAsset.created);

		// load answer button
		r = { container: new MRE.AssetContainer(context) } as Resource;
		this.resources.answerButton = r;
		p = r.container.loadGltf(baseUrl + '/answerButton.glb', 'mesh')
			.then(assets => {
				this.resources.answerButton.mainAsset = assets.find(a => !!a.prefab);
				// buttons have a cyan background
				assets.find(a => !!a.material).material.color = new MRE.Color4(.1477, .3514, .3773, 1);
			});
		promises.push(p);

		// load square button
		r = { container: new MRE.AssetContainer(context) } as Resource;
		this.resources.squareButton = r;
		p = r.container.loadGltf(baseUrl + '/menuButtonSquare.glb', 'mesh')
			.then(assets => {
				this.resources.squareButton.mainAsset = assets.find(a => !!a.prefab);
			});
		promises.push(p);

		// load back texture
		r = { container: new MRE.AssetContainer(context) } as Resource;
		this.resources.back = r;
		r.mainAsset = r.container.createMaterial('back', {
			mainTextureId: r.container.createTexture('back', {
				uri: baseUrl + '/textures/back.png'
			}).id
		});
		promises.push(r.mainAsset.created);

		// load screen
		r = { container: new MRE.AssetContainer(context) } as Resource;
		this.resources.screen = r;
		p = r.container.loadGltf(baseUrl + '/screen.glb')
			.then(assets => {
				this.resources.screen.mainAsset = assets.find(a => !!a.prefab);
			});
		promises.push(p);

		const soundContainer = new MRE.AssetContainer(context);
		const buzz = soundContainer.createSound('buzz', {uri: baseUrl + '/sounds/ding.ogg'});
		this.resources.buzz = { container: soundContainer, mainAsset: buzz };
		promises.push(buzz.created);

		const correct = soundContainer.createSound('correct', {uri: baseUrl + '/sounds/correct.ogg'});
		this.resources.correct = { container: soundContainer, mainAsset: correct };
		promises.push(correct.created);

		const wrong = soundContainer.createSound('wrong', {uri: baseUrl + '/sounds/wrong.ogg'});
		this.resources.wrong = { container: soundContainer, mainAsset: wrong };
		promises.push(wrong.created);

		const rise = soundContainer.createSound('rise', {uri: baseUrl + '/sounds/rise.ogg'});
		this.resources.rise = { container: soundContainer, mainAsset: rise };
		promises.push(rise.created);

		const ticktock = soundContainer.createSound('ticktock', {uri: baseUrl + '/sounds/ticktock.ogg'});
		this.resources.ticktock = { container: soundContainer, mainAsset: ticktock };
		promises.push(ticktock.created);

		const click = soundContainer.createSound('click', {uri: baseUrl + '/sounds/click.ogg'});
		this.resources.click = { container: soundContainer, mainAsset: click };
		promises.push(click.created);

		return Promise.all(promises).then<void>();
	}
}
