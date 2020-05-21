import { DepartmentNamePipe } from "./department-name.pipe";


describe('DepartmenyNamePipe', () => {
  it('create an instance', () => {
    const pipe = new DepartmentNamePipe();
    expect(pipe).toBeTruthy();
  });
});
