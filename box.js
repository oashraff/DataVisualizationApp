function Box(x_, y_, width_, height_, _category) {
    // var definitions
    this.x_ = x_;
    this.y_ = y_;
    this.height_ = height_;
    this.width_ = width_;

    this.category = _category;

    this.mouseOver = function (mouseX, mouseY) {
        // Check if the mouse over this box
        if (mouseX > this.x_ && mouseX < this.x_ + width_ && mouseY > this.y_ && mouseY < this.y_ + height_) {

            return this.category.name;
        }

        return false;

    }
    // draw func for drawing the boxes (individually)
    this.draw = function () {
        fill(this.category.colours);
        rect(this.x_, this.y_, this.width_, this.height_);
    }
}