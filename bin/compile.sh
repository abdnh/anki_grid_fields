declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

for filename in "$DIR/designer/"*'.ui'; do
  pyuic5 "$filename" > "$DIR/gui/forms/$(basename ${filename%.*})_ui_qt5.py"
  pyuic6 "$filename" > "$DIR/gui/forms/$(basename ${filename%.*})_ui_qt6.py"
done

echo 'Was successfully compiled!'
