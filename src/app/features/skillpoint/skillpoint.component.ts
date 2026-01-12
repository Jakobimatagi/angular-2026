import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-skillpoint',
  templateUrl: './skillpoint.component.html',
  styleUrls: ['./skillpoint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule],
  standalone: true
})
export class SkillpointComponent {
    public maxPoints = 10;
    public strength = 0;
    public speed = 0;
    public pointsLeft() {
        return this.maxPoints - this.strength - this.speed;
    }

    constructor() {
    }

    public addStrength() {
        if (this.pointsLeft() > 0) {
            this.strength++;
        }
    }

    public addSpeed() {
        if (this.pointsLeft() > 0) {
            this.speed++;
        }
    }
    public decreaseStrength() {
        if (this.strength > 0) {
            this.strength--;
        }
    }

    public decreaseSpeed() {
        if (this.speed > 0) {
            this.speed--;
        }
    }

    public resetPoints() {
        this.strength = 0;
        this.speed = 0;
    }

}
