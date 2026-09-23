# Bakes the Apple Maps-style globe texture from Natural Earth II (public domain).
# Inputs, downloaded next to this script into ne/:
#   https://naciscdn.org/naturalearth/50m/raster/NE2_50M_SR_W.zip (unzipped)
#   ne_50m_admin_0_boundary_lines_land.geojson from nvkelso/natural-earth-vector
# Requires Pillow and numpy. Copy the two .webp outputs to src/assets/images/globe/.
import json, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
Image.MAX_IMAGE_PIXELS = None
src = Image.open('ne/NE2_50M_SR_W/NE2_50M_SR_W.tif').convert('RGB')
W, H = 8192, 4096
img = src.resize((W, H), Image.LANCZOS)
a = np.asarray(img).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
water = ((b - r) > 35) & (b > g)
mask = Image.fromarray((water * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
m = np.asarray(mask).astype(np.float32)[..., None] / 255

# Land: a touch more saturation and warmth
land = np.asarray(ImageEnhance.Color(img).enhance(1.25)).astype(np.float32)
land = np.clip(land * [1.02, 1.02, 0.97], 0, 255)
# Ocean: map source luminance (bathymetry shading) onto a deep-to-shelf blue ramp
lum = (0.3 * r + 0.59 * g + 0.11 * b)[..., None]
t = np.clip((lum - 95) / 110, 0, 1) ** 1.3
deep, shelf = np.array([14, 58, 112]), np.array([74, 150, 214])
ocean = deep + (shelf - deep) * t
out = land * (1 - m) + ocean * m
base = Image.fromarray(out.astype(np.uint8))

# Country borders, drawn at 2x then downsampled for anti-aliasing
S2 = 2
ov = Image.new('L', (W * S2, H * S2), 0)
d = ImageDraw.Draw(ov)
def px(lng, lat): return ((lng + 180) / 360 * W * S2, (90 - lat) / 180 * H * S2)
for f in json.load(open('ne/borders.geojson'))['features']:
    geom = f['geometry']
    lines = geom['coordinates'] if geom['type'] == 'MultiLineString' else [geom['coordinates']]
    for line in lines:
        d.line([px(*c[:2]) for c in line], fill=255, width=3)
ov = ov.resize((W, H), Image.LANCZOS)
white = Image.new('RGB', (W, H), (255, 255, 255))
base = Image.composite(white, base, ov.point(lambda v: int(v * 0.45)))

base.save('earth-apple-8k.webp', quality=82, method=6)
base.resize((4096, 2048), Image.LANCZOS).save('earth-apple-4k.webp', quality=82, method=6)
