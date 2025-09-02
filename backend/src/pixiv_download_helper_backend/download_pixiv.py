import os
import time
from pathlib import Path

import piexif
import piexif.helper
import requests
from dotenv import load_dotenv
from PIL import Image, PngImagePlugin

from .schemas import IllustInfo

load_dotenv(override=True)

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/130.0.0.0 Safari/537.36"
    )
}

DOWNLOAD_DIR = os.getenv("DOWNLOAD_DIR", Path.cwd())
IMAGE_SAVE_DIR = Path(DOWNLOAD_DIR) / "data" / "images"

IMAGE_SAVE_DIR.mkdir(parents=True, exist_ok=True)


def embed_metadata(image_path: Path, illust_info: IllustInfo) -> None:
    """
    Embeds metadata into the image based on its format.
    """
    metadata_str = illust_info.model_dump_json()

    img = Image.open(image_path)
    img_format = img.format

    if img_format == "PNG":
        png_info = PngImagePlugin.PngInfo()
        png_info.add_text("metadata", metadata_str)
        img.save(image_path, pnginfo=png_info)
        print(f"Embedded metadata into PNG: {image_path.name}")
    elif img_format in ["JPEG", "JPG"]:
        exif_data = img.info.get("exif")
        if exif_data:
            try:
                exif_dict = piexif.load(exif_data)
            except piexif.InvalidImageDataError:
                exif_dict = {
                    "0th": {},
                    "Exif": {},
                    "1st": {},
                    "thumbnail": None,
                    "GPS": {},
                }
        else:
            exif_dict = {"0th": {}, "Exif": {}, "1st": {}, "thumbnail": None, "GPS": {}}

        # Set the user comment with the metadata
        exif_dict["Exif"][piexif.ExifIFD.UserComment] = piexif.helper.UserComment.dump(
            metadata_str, encoding="unicode"
        )

        # Dump the exif data to bytes and save it
        exif_bytes = piexif.dump(exif_dict)
        if exif_bytes:
            img.save(image_path, exif=exif_bytes)
        else:
            # Fallback: if piexif.dump returns empty bytes, save without exif argument.
            img.save(image_path)
        print(f"Embedded metadata into JPEG: {image_path.name}")
    elif img_format == "GIF":
        img.save(image_path, save_all=True, comment=metadata_str.encode("utf-8"))
        print(f"Embedded metadata into GIF: {image_path.name}")
    else:
        print(
            f"Metadata embedding not supported for format {img_format}: {image_path.name}"
        )


def download_image(illust_info: IllustInfo) -> None:
    """
    Downloads images and embeds metadata.
    """
    num_images = len(illust_info.image_urls)
    for i, image_url in enumerate(illust_info.image_urls):
        try:
            referer = f"https://www.pixiv.net/artworks/{illust_info.illust_id}"
            headers = DEFAULT_HEADERS.copy()
            headers["Referer"] = referer

            response = requests.get(image_url, headers=headers)
            response.raise_for_status()

            image_name = Path(image_url).name
            save_path = IMAGE_SAVE_DIR / image_name

            with open(save_path, "wb") as f:
                f.write(response.content)
            print(f"Image downloaded: {save_path}")

            embed_metadata(save_path, illust_info)

        except requests.RequestException as e:
            print(f"Failed to download {image_url}: {e}")
        finally:
            if i < num_images - 1:
                time.sleep(1.1)
