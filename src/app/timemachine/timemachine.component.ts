import {AfterViewInit, Component, Directive, HostListener, Input, OnInit, TemplateRef} from '@angular/core';

// @ts-ignore

@Directive({
             selector: '[myPanel]'
           })
export class PanelDirective {
}

@Directive({
             selector: '[myHeader]'
           })
export class HeaderDirective {
}

// @ts-ignore
@Component({
             selector: 'my-timemachine',
             templateUrl: './timemachine.component.html',
             styleUrls: [ './timemachine.component.css' ]
           })
export class TimemachineComponent implements OnInit, AfterViewInit {

  @Input() items: string[] = [];
  @Input() zIndexOffset = 1;
  @Input() panel: TemplateRef<any>;
  @Input() glasspane = false;
  @Input() shiftSpace = 50;
  @Input() height = 300;
  @Input() width = 550;

  historyItemStyles: any[] = [];
  currentItem = 0;

  constructor() {
  }

  @HostListener('window:keydown.arrowUp', ['$event']) next(event: KeyboardEvent) {
    event.preventDefault();
    this.nextItem();
  }

  @HostListener('window:keydown.arrowDown', ['$event']) prev(event: KeyboardEvent) {
    event.preventDefault();
    this.prevItem();
  }

  toggleGlasspane() {
    this.glasspane = !this.glasspane;
  }

  ngOnInit() {
    if (!this.items) {
      this.items = [];
    }
    this.calcCssForItem(0);
  }

  ngAfterViewInit() {
    console.log(this.panel);
  }

  getHistoryItemStyle(ix: number) {
    return this.historyItemStyles[ ix ];
  }

  getNavigationStyle() {
    return {
      'margin-left': this.width + 'px',
      'margin-top': (this.height / 2) + 'px'
    };
  }

  getTimeMachineStyle() {
    return {
      'width': this.width + 'px',
      'height': this.height + 'px'
    };
  }

  getItemsStyle() {
    return {
      'perspective': this.width + 'px'
    };
  }

  moveToItem(ix: number) {
    this.currentItem = ix;
    this.calcCssForItem(ix);
  }

  nextItem() {
    if (this.currentItem < this.items.length - 1) {
      this.currentItem++;
      this.calcCssForItem(this.currentItem);
    }
  }

  prevItem() {
    if (this.currentItem > 0) {
      this.currentItem--;
      this.calcCssForItem(this.currentItem);
    }
  }

  keyDown(event: KeyboardEvent) {
    if (event.code === 'ArrowUp') {
      this.nextItem();
    } else if (event.code === 'ArrowDown') {
      this.prevItem();
    }
  }

  private calcCssForItem(start: number) {
    this.historyItemStyles = [];
    const siz = this.items.length;
    let ix = 0;
    this.items.forEach(item => {
      const opacity = ix < start ? 0 : 1;
      const zindex = ix < start ? 0 : siz - (this.zIndexOffset + ix);
      const offsetX = ix < start ? 0 : (ix - start) * -this.shiftSpace;
      const offsetY = ix < start ? 0 : this.calcYOffset(ix - start);
      console.log('offsetY=' + offsetY);
      this.historyItemStyles.push({
                                    height: this.height + 'px',
                                    width: this.width + 'px',
                                    opacity: opacity,
                                    'z-index': zindex,
                                    transform: 'translate3d(' + (-offsetX / 2) + 'px, ' + offsetY + 'px, ' + offsetX + 'px)'
                                  });
      ix++;
    });
  }

  private mousewheelEvent(ev: WheelEvent) {
    if (ev.deltaY >= 0) {
      this.nextItem();
    } else {
      this.prevItem();
    }

  }

  /**
   * calcule l'offset vertical entre le panel de rang rank et le précédent
   * @param number
   */
  private calcYOffset(rank: number) {
    if (rank < 0) {
      return 0;
    }
    return rank === 0 ? -this.shiftSpace : this.calcYOffset(rank - 1) - Math.pow(.8, rank) * this.shiftSpace;
  }
}
