import should from 'should';
import { hsl2rgb, rgb2hsl } from '../../src/color/color';

const colors = [
	{
		hsl: { hue: 0, saturation: 0, lightness: 0 },
		rgb: { red: 0, green: 0, blue: 0 }
	},
	{
		hsl: { hue: 0, saturation: 100, lightness: 50 },
		rgb: { red: 255, green: 0, blue: 0 }
	},
	{
		hsl: { hue: 120, saturation: 100, lightness: 50 },
		rgb: { red: 0, green: 255, blue: 0 }
	},
	{
		hsl: { hue: 240, saturation: 100, lightness: 50 },
		rgb: { red: 0, green: 0, blue: 255 }
	},
	{
		hsl: { hue: 60, saturation: 100, lightness: 50 },
		rgb: { red: 255, green: 255, blue: 0 }
	},
	{
		hsl: { hue: 300, saturation: 100, lightness: 50 },
		rgb: { red: 255, green: 0, blue: 255 },
	},
	{
		hsl: { hue: 180, saturation: 100, lightness: 50 },
		rgb: { red: 0, green: 255, blue: 255 }
	},
	{
		hsl: { hue: 0, saturation: 0, lightness: 100 },
		rgb: { red: 255, green: 255, blue: 255 }
	},
	{
		hsl: { hue: 149, saturation: 52, lightness: 36 },
		rgb: { red: 44, green: 140, blue: 90 },
	},
	{
		hsl: { hue: 176, saturation: 70, lightness: 55 },
		rgb: { red: 60, green: 221, blue: 210 }
	},
];

describe('color', () => {
	describe('rgb2hsl', () => {
		it('should convert RGB colors correctly to HSL colors', () => {
			for (const color of colors) {
				const { rgb, hsl: expected } = color;
				should(rgb2hsl(rgb)).deepEqual(
					expected,
					`RGB color ${JSON.stringify(rgb)} expected to be converted to ${JSON.stringify(expected)}`
				);
			}
		});
	});

	describe('hsl2rgb', () => {
		it('should convert HSL colors correctly to RGB colors', () => {
			for (const color of colors) {
				const { hsl, rgb: expected } = color;
				should(hsl2rgb(hsl)).deepEqual(
					expected,
					`RGB color ${JSON.stringify(hsl)} expected to be converted to ${JSON.stringify(expected)}`,
				);
			}
		});
	});
});
