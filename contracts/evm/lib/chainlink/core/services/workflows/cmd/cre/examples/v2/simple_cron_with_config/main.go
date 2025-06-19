//go:build wasip1

package main

import (
	"fmt"

	"github.com/smartcontractkit/chainlink-common/pkg/capabilities/v2/triggers/cron"
	"github.com/smartcontractkit/chainlink-common/pkg/workflows/sdk/v2"
	"github.com/smartcontractkit/chainlink-common/pkg/workflows/wasm/v2"
	"gopkg.in/yaml.v3"
)

type runtimeConfig struct {
	Schedule string `yaml:"schedule"`
}

func RunSimpleCronWorkflow(wcx *sdk.WorkflowContext[*runtimeConfig]) (sdk.Workflow[*runtimeConfig], error) {

	cfg := &cron.Config{
		Schedule: wcx.Config.Schedule,
	}

	return sdk.Workflow[*runtimeConfig]{
		sdk.On(
			cron.Trigger(cfg),
			onTrigger,
		),
	}, nil
}

func onTrigger(wcx *sdk.WorkflowContext[*runtimeConfig], runtime sdk.Runtime, outputs *cron.Payload) (string, error) {
	return fmt.Sprintf("ping (Schedule: %s)", wcx.Config.Schedule), nil
}

func main() {
	wasm.NewRunner(func(b []byte) (*runtimeConfig, error) {
		cfg := &runtimeConfig{}
		if err := yaml.Unmarshal(b, &cfg); err != nil {
			return nil, err
		}

		return cfg, nil
	}).Run(RunSimpleCronWorkflow)
}
