import { confetti, type ConfettiFirstParam } from '@tsparticles/confetti';

const count = 200,
  defaults: ConfettiFirstParam = {
    origin: { y: 0.7 },
  };

async function fire(particleRatio: number, opts: object) {
  await confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    })
  );
}

export default async function fireConfetti() {
  await fire(0.25, {
    spread: 26,
    startVelocity: 55
  });

  await fire(0.2, {
    spread: 60
  });

  await fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  await fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  await fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}
