import json
from pathlib import Path

from .image_utils import read_metadata_from_image

def main() -> None:
    """
    Interactively prompts the user for an image path and displays its metadata.
    """
    while True:
        print("\n" + "-" * 50)
        raw_path = input("Please enter the path to the image file (or type 'exit' to quit): ")

        if raw_path.lower() == 'exit':
            break

        # Windows "Copy as path" often includes quotes, so we remove them.
        cleaned_path = raw_path.strip().strip('"')
        image_path = Path(cleaned_path)

        metadata = read_metadata_from_image(image_path)

        if metadata:
            print("\n--- Embedded Metadata ---")
            # Use ensure_ascii=False to correctly display Japanese characters.
            pretty_metadata = json.dumps(metadata, indent=4, ensure_ascii=False)
            print(pretty_metadata)
        else:
            # Error messages are printed within the read function itself.
            print("Could not read or find metadata.")

if __name__ == "__main__":
    main()

