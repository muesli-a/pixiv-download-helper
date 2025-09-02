import json
from pathlib import Path
from typing import Any, Dict, Optional

import piexif
import piexif.helper
from PIL import Image


def read_metadata_from_image(image_path: Path) -> Optional[Dict[str, Any]]:
    """
    Reads embedded metadata from an image file (PNG, JPEG, or GIF).

    Args:
        image_path: The path to the image file.

    Returns:
        A dictionary containing the metadata if found, otherwise None.
    """
    if not image_path.exists():
        print(f"Error: Image file not found at {image_path}")
        return None

    try:
        img = Image.open(image_path)
        img_format = img.format
        metadata_str: Optional[str] = None

        if img_format == "PNG":
            metadata_str = img.info.get("metadata")
        elif img_format in ["JPEG", "JPG"]:
            if "exif" in img.info:
                exif_dict = piexif.load(img.info["exif"])
                user_comment_bytes = exif_dict.get("Exif", {}).get(piexif.ExifIFD.UserComment)
                if user_comment_bytes:
                    metadata_str = piexif.helper.UserComment.load(user_comment_bytes)
        elif img_format == "GIF":
            if "comment" in img.info:
                comment = img.info.get("comment")
                if isinstance(comment, bytes):
                    metadata_str = comment.decode("utf-8")

        if metadata_str:
            return json.loads(metadata_str)
        else:
            print(f"No 'metadata' found in {image_path.name}")
            return None

    except Exception as e:
        print(f"Failed to read metadata from {image_path.name}: {e}")
        return None
