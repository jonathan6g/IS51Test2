import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  params: string;
  nameFixed: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTests();


  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
    } else {
      tests = await this.loadTestsFromJson();
    }
    console.log('this.tests from ngOninit...', this.tests);
    this.tests = tests;
    return tests;
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null

    };
    this.tests.unshift(test);
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }


  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  calculate() {
    let pointsPossible = 0;
    let pointsReceived = 0;
    let grade = '';
    let totalPercentage = 0;

    for (let i = 0; i < this.tests.length; i++) {

      pointsPossible += this.tests[i].pointsPossible;
      pointsReceived += this.tests[i].pointsReceived;

    }

    if (this.params === null) {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
      return null;
    } else if (this.params.search(', ') === -1) {
      this.toastService.showToast('warning', 5000, 'Name must contain a comma and a space');
      return null;
    } else {

      totalPercentage = pointsReceived / pointsPossible;
      if ((totalPercentage) >= .9) {
        grade = 'A';
      } else if ((totalPercentage) >= .8) {
        grade = 'B';
      } else if ((totalPercentage) >= .7) {
        grade = 'C';
      } else if ((totalPercentage) >= .6) {
        grade = 'D';
      } else {
        grade = 'F';
      }
      }

    return {
      name: this.nameFixed,
      pointsPossible: pointsPossible,
      pointsReceived: pointsReceived,
      totalPercentage: pointsReceived / pointsPossible,
      grade: grade
    };
  }

  compute(params: string) {
    if (params == null) {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
    } else {
      const commaIndex = this.params.indexOf(', ');
      const firstName = this.params.slice(commaIndex + 2, this.params.length);
      const lastName = this.params.slice(0, commaIndex);
      this.nameFixed = firstName + ' ' + lastName;
      const data = this.calculate();
      this.router.navigate(['home', data]);

  }
}

}
