import { NotActiveModule } from './not-active.module';

describe('NotActiveModule', () => {
  let notActiveModule: NotActiveModule;

  beforeEach(() => {
    notActiveModule = new NotActiveModule();
  });

  it('should create an instance', () => {
    expect(notActiveModule).toBeTruthy();
  });
});
