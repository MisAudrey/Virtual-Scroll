import { 
  Component, 
  OnInit, 
  Input,
  AfterContentInit,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.css']
})
export class VirtualScrollComponent implements OnInit, AfterContentInit {

  @Input() itemCount: number;
  @Input() width: number;
  @Input() childWidth: number;
  @Input() items: any;
  @Input() nodePadding = 0;

  renderAhead = 2

  public totalContentWidth: number;
  public offsetX: number = 0;
  public visibleItems: any;

  // Number of rows displayed in the viewport
  rowsNumber = Array.from({length: 51}, (_, i) => i);

  @ViewChild('container', { static: true}) private scrollContainer: ElementRef;
  
  constructor(private zone: NgZone) { }

  ngOnInit() {
    // Total size of virtual scrolling container
    this.totalContentWidth = this.itemCount * this.childWidth;
  }

  ngAfterContentInit() {
     // Create Listener for detecting moved scroll bar
     this.zone.runOutsideAngular(() => {
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this))
    });

    this.onScroll();
  }

  onScroll() {
      // Core of virtual scrolling
      // The first node is derived from the viewport's scrollLeft
      // divided by row height
      // we have some padding of nodes to allow for smooth scrolling
      let scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
      let startNode = Math.floor(scrollLeft / this.childWidth) - this.renderAhead;
      startNode = Math.max(0, startNode);
      let visibleNodesCount = Math.ceil(this.width / this.childWidth) + 2 * this.renderAhead;
      visibleNodesCount = Math.min(this.itemCount - startNode, visibleNodesCount);
      this.visibleItems = [Array(visibleNodesCount).fill(null), Array(visibleNodesCount).fill(null)];

      // Shift the nodes
      // When we render the visible nodes inside the container
      // they render at the left of the container
      // What we need to do now is shift them right to their correct position
      this.zone.runTask(() => {
        this.offsetX = startNode * this.childWidth;
        for(let i = 0; i < 51; i++) {
          this.visibleItems[i] = new Array(visibleNodesCount).fill(null)
                  .map((_, index) => this.items[i][index + startNode]);
        }
      })
     

  }

}
