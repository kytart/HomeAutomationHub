import convert from 'color-convert';

export interface RGBColor {
	red: number;
	green: number;
	blue: number;
}

export interface HSLColor {
	hue: number;
	saturation: number;
	lightness: number;
}

export function rgb2hsl(rgb: RGBColor) {
	const { red, green, blue } = rgb;
	const [hue, saturation, lightness] = convert.rgb.hsl([red, green, blue]);
	return { hue, saturation, lightness };
}

export function hsl2rgb(hsl: HSLColor) {
	const { hue, saturation, lightness } = hsl;
	const [red, green, blue] = convert.hsl.rgb([hue, saturation, lightness]);
	return { red, green, blue };
}
