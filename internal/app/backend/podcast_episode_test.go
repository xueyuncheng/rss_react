package backend

import "testing"

func Test_parseDuration(t *testing.T) {
	type args struct {
		durationStr string
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		{
			name: "test1",
			args: args{
				durationStr: "2407",
			},
			want:    "40m",
			wantErr: false,
		},
		{
			name: "test2",
			args: args{
				durationStr: "1:00",
			},
			want:    "1m",
			wantErr: false,
		},
		{
			name: "test3",
			args: args{
				durationStr: "1:04:00",
			},
			want:    "1h4m",
			wantErr: false,
		},
		{
			name: "test4",
			args: args{
				durationStr: "17",
			},
			want:    "17s",
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseDuration(tt.args.durationStr)
			if (err != nil) != tt.wantErr {
				t.Errorf("parseDuration() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("parseDuration() = %v, want %v", got, tt.want)
			}
		})
	}
}
