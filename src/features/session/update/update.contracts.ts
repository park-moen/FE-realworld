import { UpdateUserDtoSchema } from '~shared/api/api.schemas';

export const UpdateUserSchema = UpdateUserDtoSchema.shape.user.refine((args) => Object.keys(args).length > 0, {
  error: 'At least one field must be provided',
});
