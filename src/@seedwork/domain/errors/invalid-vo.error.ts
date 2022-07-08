export class InvalidVoError extends Error {
  constructor() {
    super('ID must be a valid')
    this.name = 'InvalidVoError';
  }
}