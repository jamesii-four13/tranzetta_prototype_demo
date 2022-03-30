module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'b708c8ccc42dd3fb84780d0fef26b996'),
  },
});
