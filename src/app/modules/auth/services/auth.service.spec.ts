import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environments';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let cookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['set', 'get', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: CookieService, useValue: cookieServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send credentials and save token from tokenSession', (done) => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockResponse = { tokenSession: 'mock-token-123' };

    spyOn(console, 'log');

    service.sendCredentials(mockEmail, mockPassword).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(cookieService.set).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Token saved:', 'mock-token-123');
      done();
    });

    const req = httpMock.expectOne(`${environment.api}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockEmail, password: mockPassword });
    req.flush(mockResponse);
  });

  it('should save token from token property if tokenSession not present', (done) => {
    const mockEmail = 'user@test.com';
    const mockPassword = 'pass456';
    const mockResponse = { token: 'alternative-token-456' };

    service.sendCredentials(mockEmail, mockPassword).subscribe(() => {
      expect(cookieService.set).toHaveBeenCalled();
      done();
    });

    const req = httpMock.expectOne(`${environment.api}/auth/login`);
    req.flush(mockResponse);
  });

  it('should save token from accessToken property if others not present', (done) => {
    const mockEmail = 'admin@test.com';
    const mockPassword = 'admin789';
    const mockResponse = { accessToken: 'access-token-789' };

    service.sendCredentials(mockEmail, mockPassword).subscribe(() => {
      expect(cookieService.set).toHaveBeenCalled();
      done();
    });

    const req = httpMock.expectOne(`${environment.api}/auth/login`);
    req.flush(mockResponse);
  });

  it('should log error when no token found in response', (done) => {
    const mockResponse = { message: 'Login successful but no token' };
    spyOn(console, 'error');

    service.sendCredentials('test@test.com', 'pass').subscribe(() => {
      expect(console.error).toHaveBeenCalledWith('Token not found in response:', mockResponse);
      expect(cookieService.set).not.toHaveBeenCalled();
      done();
    });

    const req = httpMock.expectOne(`${environment.api}/auth/login`);
    req.flush(mockResponse);
  });

  it('should log credentials being sent', () => {
    spyOn(console, 'log');
    const email = 'test@example.com';
    const password = 'testpass';

    service.sendCredentials(email, password).subscribe();

    expect(console.log).toHaveBeenCalledWith('Sending credentials', { email, password });

    const req = httpMock.expectOne(`${environment.api}/auth/login`);
    req.flush({ tokenSession: 'token' });
  });
});
